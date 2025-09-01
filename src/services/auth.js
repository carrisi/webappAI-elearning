import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Registrazione con ruolo
export async function registerWithRole({ email, password, role, name, surname }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  // displayName in Auth = "Nome Cognome"
  const displayName = [name, surname].filter(Boolean).join(' ').trim();
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }

  // Documento profilo in Firestore
  await setDoc(doc(db, "users", cred.user.uid), {
    uid: cred.user.uid,
    email,
    role,                        // "student" | "teacher"
    name: name || null,
    surname: surname || null,
    displayName: displayName || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  return cred.user;
}


// Login
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Reset password
export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

// Logout
export function logout() {
  return signOut(auth);
}

// Osserva lo stato auth + profilo
export function observeAuth(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback({ user: null, profile: null });
      return;
    }
    const snap = await getDoc(doc(db, "users", user.uid));
    callback({ user, profile: snap.exists() ? snap.data() : null });
  });
}
