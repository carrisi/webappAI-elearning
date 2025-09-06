// src/services/courses.js
import { auth, db } from "../firebase";
import {
  collection, doc, addDoc, updateDoc, getDoc, getDocs,
  query, where, orderBy, serverTimestamp,
  deleteDoc, writeBatch
} from "firebase/firestore";

/* ------------------------------ MAPPERS ------------------------------ */

function mapCourse(docSnap) {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    titolo: d.titolo || "",
    descrizione: d.descrizione || "",
    stato: d.stato || "attivo",
    imageUrl: d.imageUrl ?? null,
    introduzione: d.introduzione || {},
    createdAt: d.createdAt || null, // utile per ordinare lato client in fallback
  };
}

const mapSection = (snap) => {
  const x = snap.data();
  return {
    id: snap.id,
    title: x.title || "",
    description: x.description || "",
    order: x.order ?? 0,
    createdAt: x.createdAt || null,
  };
};

const mapLesson = (snap) => {
  const x = snap.data();
  return {
    id: snap.id,
    title: x.title || "",
    description: x.description || "",
    duration: x.duration || "",
    fileTypes: x.fileTypes || [],
    videoUrl: x.videoUrl || "",
    type: x.type || null,
    createdAt: x.createdAt || null,
  };
};

/* ------------------------------ CORSO ------------------------------ */

// Crea corso (+ opzionale prima sezione/lezione)
export async function createCourseWithInitialSectionAndLesson({
  titolo, descrizione, stato = "attivo",
  introd = {},
  initialSectionTitle,
  initialLesson, // { title, fileTypes?, videoUrl?, duration?, description?, type? }
}) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("not-authenticated");

  const courseRef = await addDoc(collection(db, "courses"), {
    titolo,
    descrizione,
    stato,
    ownerId: uid,
    imageUrl: null,
    introduzione: {
      academicYear: introd.academicYear || "",
      professor: introd.professor || "",
      degree: introd.degree || "",
      semester: introd.semester || "",
      credits: introd.credits ?? null,
      notes: introd.notes || "",
      officeHoursTitle: introd.officeHoursTitle || "",
      officeHours: introd.officeHours || "",
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Sezione iniziale opzionale
  if (initialSectionTitle) {
    const secRef = await addDoc(collection(db, "courses", courseRef.id, "sections"), {
      title: initialSectionTitle,
      description: "",
      order: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Lezione iniziale opzionale
    if (initialLesson?.title) {
      await addDoc(collection(db, "courses", courseRef.id, "sections", secRef.id, "lessons"), {
        title: initialLesson.title,
        description: initialLesson.description || "",
        duration: initialLesson.duration || "",
        fileTypes: initialLesson.fileTypes || [],
        videoUrl: initialLesson.videoUrl || "",
        type: initialLesson.type || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  }

  return courseRef.id;
}

// Aggiorna intestazione/introduzione
export async function updateCourseHeader(courseId, { titolo, descrizione, introd = {} }) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("not-authenticated");

  const ref = doc(db, "courses", courseId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("not-found");
  if (snap.data().ownerId !== uid) throw new Error("forbidden");

  await updateDoc(ref, {
    titolo,
    descrizione,
    introduzione: {
      academicYear: introd.academicYear || "",
      professor: introd.professor || "",
      degree: introd.degree || "",
      semester: introd.semester || "",
      credits: introd.credits ?? null,
      notes: introd.notes || "",
      officeHoursTitle: introd.officeHoursTitle || "",
      officeHours: introd.officeHours || "",
    },
    updatedAt: serverTimestamp(),
  });
}

// Dettaglio corso
export async function getCourseById(courseId) {
  const ref = doc(db, "courses", courseId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapCourse(snap);
}

// Lista corsi del docente corrente (con fallback se manca l'indice)
export async function listMyCourses() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("not-authenticated");

  try {
    const q = query(
      collection(db, "courses"),
      where("ownerId", "==", uid),
      orderBy("createdAt", "desc")
    );
    const res = await getDocs(q);
    return res.docs.map(mapCourse);
  } catch (err) {
    // Se manca l'indice per ownerId+createdAt: fallback senza orderBy
    if (err?.code === "failed-precondition") {
      const q2 = query(collection(db, "courses"), where("ownerId", "==", uid));
      const res2 = await getDocs(q2);
      return res2.docs
        .map(mapCourse)
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }
    throw err;
  }
}

/* ------------------------------ SEZIONI ------------------------------ */

export async function listSections(courseId) {
  try {
    const q = query(
      collection(db, "courses", courseId, "sections"),
      orderBy("order", "asc")
    );
    const res = await getDocs(q);
    return res.docs.map(mapSection);
  } catch {
    // fallback senza indice
    const res = await getDocs(collection(db, "courses", courseId, "sections"));
    return res.docs.map(mapSection).sort((a, b) => a.order - b.order);
  }
}

export async function createSection(courseId, { title, description = "", order = 1 }) {
  const ref = await addDoc(collection(db, "courses", courseId, "sections"), {
    title,
    description,
    order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateSection(courseId, sectionId, { title, description, order }) {
  const ref = doc(db, "courses", courseId, "sections", sectionId);
  const payload = { updatedAt: serverTimestamp() };
  if (typeof title === "string") payload.title = title;
  if (typeof description === "string") payload.description = description;
  if (typeof order === "number") payload.order = order;
  await updateDoc(ref, payload);
}

// Elimina sezione + TUTTE le lezioni figlie
export async function deleteSectionDeep(courseId, sectionId) {
  // cancella lezioni a batch (chunk per evitare limiti)
  const lessonsSnap = await getDocs(collection(db, "courses", courseId, "sections", sectionId, "lessons"));
  let batch = writeBatch(db);
  let i = 0;
  for (const d of lessonsSnap.docs) {
    batch.delete(d.ref);
    i++;
    if (i === 450) { await batch.commit(); batch = writeBatch(db); i = 0; }
  }
  if (i > 0) await batch.commit();
  // cancella la sezione
  await deleteDoc(doc(db, "courses", courseId, "sections", sectionId));
}

/* ------------------------------ LEZIONI ------------------------------ */

export async function listLessons(courseId, sectionId) {
  const res = await getDocs(collection(db, "courses", courseId, "sections", sectionId, "lessons"));
  return res.docs.map(mapLesson);
}

export async function createLesson(courseId, sectionId, payload) {
  const ref = await addDoc(collection(db, "courses", courseId, "sections", sectionId, "lessons"), {
    title: payload.title,
    description: payload.description || "",
    duration: payload.duration || "",
    fileTypes: payload.fileTypes || [],
    videoUrl: payload.videoUrl || "",
    type: payload.type || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateLesson(courseId, sectionId, lessonId, payload) {
  const ref = doc(db, "courses", courseId, "sections", sectionId, "lessons", lessonId);
  const upd = {
    updatedAt: serverTimestamp(),
  };
  ["title", "description", "duration", "videoUrl", "type"].forEach(k => {
    if (payload[k] !== undefined) upd[k] = payload[k];
  });
  if (Array.isArray(payload.fileTypes)) upd.fileTypes = payload.fileTypes;
  await updateDoc(ref, upd);
}

export async function deleteLesson(courseId, sectionId, lessonId) {
  const ref = doc(db, "courses", courseId, "sections", sectionId, "lessons", lessonId);
  await deleteDoc(ref);
}

/* ------------------------------ DELETE CORSO (deep) ------------------------------ */
/**
 * Elimina un corso e tutte le sottocollezioni note:
 * - sections → lessons
 * - assessments → grades
 * - materials (se presente)
 * Poi elimina il documento corso.
 */
export async function deleteCourseDeep(courseId) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("not-authenticated");

  const courseRef = doc(db, "courses", courseId);
  const snap = await getDoc(courseRef);
  if (!snap.exists()) return; // già eliminato
  if (snap.data().ownerId !== uid) throw new Error("forbidden");

  const toDelete = [];

  // sections -> lessons
  const secSnap = await getDocs(collection(db, "courses", courseId, "sections"));
  for (const sec of secSnap.docs) {
    const lesSnap = await getDocs(collection(db, "courses", courseId, "sections", sec.id, "lessons"));
    for (const les of lesSnap.docs) {
      toDelete.push(doc(db, "courses", courseId, "sections", sec.id, "lessons", les.id));
    }
    toDelete.push(doc(db, "courses", courseId, "sections", sec.id));
  }

  // assessments -> grades
  const assessSnap = await getDocs(collection(db, "courses", courseId, "assessments"));
  for (const a of assessSnap.docs) {
    const gradesSnap = await getDocs(collection(db, "courses", courseId, "assessments", a.id, "grades"));
    for (const g of gradesSnap.docs) {
      toDelete.push(doc(db, "courses", courseId, "assessments", a.id, "grades", g.id));
    }
    toDelete.push(doc(db, "courses", courseId, "assessments", a.id));
  }

  // materials (se esiste)
  try {
    const matSnap = await getDocs(collection(db, "courses", courseId, "materials"));
    for (const m of matSnap.docs) {
      toDelete.push(doc(db, "courses", courseId, "materials", m.id));
    }
  } catch { /* sottocollezione assente: ignora */ }

  // Commit in chunk (max 500 op/batch)
  for (let i = 0; i < toDelete.length; i += 400) {
    const batch = writeBatch(db);
    for (const ref of toDelete.slice(i, i + 400)) batch.delete(ref);
    await batch.commit();
  }

  // Elimina il documento del corso
  await deleteDoc(courseRef);
}
