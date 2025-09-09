// src/services/enrollments.js
import { auth, db } from "../firebase";
import {
  addDoc, collection, getDocs, query, where, serverTimestamp
} from "firebase/firestore";

/**
 * Restituisce tutte le mie iscrizioni (attive o inattive) su /enrollments.
 * Ogni doc ha almeno: { id, userId, courseId, role, status, createdAt }
 */
export async function listMyEnrollments() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("not-authenticated");

  const qy = query(collection(db, "enrollments"), where("userId", "==", uid));
  const snap = await getDocs(qy);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Crea una richiesta di iscrizione dello studente al corso.
 * Per rispettare le regole attuali, lo status sarà "inactive".
 * Puoi passare una nota facoltativa per il docente.
 */
export async function requestEnrollment(courseId, note = "") {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("not-authenticated");

  const payload = {
    userId: uid,
    courseId,
    role: "student",
    status: "inactive",      // le regole permettono solo active|inactive
    note: String(note || "").slice(0, 1000), // campo extra, non validato dalle rules
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, "enrollments"), payload);
  return ref.id;
}
