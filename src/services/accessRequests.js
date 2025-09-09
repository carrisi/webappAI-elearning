// src/services/accessRequests.js
import { auth, db } from "../firebase";
import {
  collection, collectionGroup, doc, getDoc, getDocs, query, where,
  setDoc, updateDoc, deleteDoc, serverTimestamp, orderBy, writeBatch
} from "firebase/firestore";

/**
 * Restituisce la mia richiesta per un corso (se esiste).
 * Path: /courses/{courseId}/accessRequests/{uid}
 */
export async function getMyAccessRequest(courseId) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("not-authenticated");

  const ref = doc(db, "courses", courseId, "accessRequests", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Crea (o valida se già presente) una richiesta "pending".
 * Salva anche studentDisplayName e studentEmail per uso lato docente.
 */
export async function createAccessRequest(courseId, note = "") {
  const user = auth.currentUser;
  const uid = user?.uid;
  if (!uid) throw new Error("not-authenticated");

  // Owner del corso (richiesto dalle rules)
  const courseRef = doc(db, "courses", courseId);
  const courseSnap = await getDoc(courseRef);
  if (!courseSnap.exists()) throw new Error("course-not-found");
  const ownerId = courseSnap.data()?.ownerId;
  if (!ownerId) throw new Error("course-owner-missing");

  // Evita doppioni
  const reqRef = doc(db, "courses", courseId, "accessRequests", uid);
  const existing = await getDoc(reqRef);
  if (existing.exists()) {
    const data = existing.data();
    if (data.status === "pending") throw new Error("already-pending");
    if (data.status === "approved") throw new Error("already-approved");
    if (data.status === "rejected") throw new Error("already-rejected");
  }

  // Prova a leggere il profilo utente per un displayName "pulito"
  let studentDisplayName = user?.displayName || "";
  let studentEmail = user?.email || "";
  try {
    const meRef = doc(db, "users", uid);
    const meSnap = await getDoc(meRef);
    if (meSnap.exists()) {
      const u = meSnap.data() || {};
      studentDisplayName =
        u.displayName || [u.name, u.surname].filter(Boolean).join(" ") || studentDisplayName || (studentEmail?.split("@")[0] || "");
      studentEmail = u.email || studentEmail || "";
    }
  } catch {
    // ignora: non tutti hanno il profilo popolato
  }

  const payload = {
    userId: uid,
    courseId,
    courseOwnerId: ownerId,
    note: String(note || "").slice(0, 1000),
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    // campi comodi lato docente
    studentDisplayName: studentDisplayName || (studentEmail ? studentEmail.split("@")[0] : uid),
    studentEmail: studentEmail || null,
  };

  await setDoc(reqRef, payload);
  return { id: uid, ...payload };
}

/**
 * Cancella la mia richiesta se è ancora "pending".
 */
export async function cancelMyAccessRequest(courseId) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("not-authenticated");
  const ref = doc(db, "courses", courseId, "accessRequests", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const status = snap.data()?.status;
  if (status !== "pending") throw new Error("cannot-cancel-non-pending");
  await deleteDoc(ref);
}

/**
 * Lista globale (docente) di richieste via collection group.
 * Filtra per owner corrente, opzionale per corso e/o stato. Ordina per data desc.
 */
export async function listOwnerRequests({ courseId = null, status = null } = {}) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("not-authenticated");

  let q = query(
    collectionGroup(db, "accessRequests"),
    where("courseOwnerId", "==", uid)
  );
  if (courseId) q = query(q, where("courseId", "==", courseId));
  if (status) q = query(q, where("status", "==", status));

  try {
    q = query(q, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data(), __path: d.ref.path }));
  } catch (err) {
    // Fallback se manca l'indice per l'orderBy
    const snap = await getDocs(q);
    return snap.docs
      .map(d => ({ id: d.id, ...d.data(), __path: d.ref.path }))
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }
}

/**
 * Aggiorna lo status della richiesta (solo docente owner).
 */
export async function setRequestStatus(courseId, studentId, status) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("not-authenticated");
  if (!["pending", "approved", "rejected"].includes(status)) throw new Error("invalid-status");

  const ref = doc(db, "courses", courseId, "accessRequests", studentId);
  await updateDoc(ref, { status, updatedAt: serverTimestamp() });
}

/**
 * Approva una richiesta e attiva l'enrollment (solo docente owner).
 */
export async function approveRequest(courseId, studentId) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("not-authenticated");

  const batch = writeBatch(db);

  const reqRef = doc(db, "courses", courseId, "accessRequests", studentId);
  batch.update(reqRef, { status: "approved", updatedAt: serverTimestamp() });

  const enrollId = `${courseId}_${studentId}`;
  const enrollRef = doc(db, "enrollments", enrollId);
  batch.set(
    enrollRef,
    {
      userId: studentId,
      courseId,
      role: "student",
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  await batch.commit();
}

/**
 * Rifiuta una richiesta (solo docente owner).
 */
export async function rejectRequest(courseId, studentId) {
  return setRequestStatus(courseId, studentId, "rejected");
}
