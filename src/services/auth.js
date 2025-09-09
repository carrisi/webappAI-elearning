import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

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

export function observeAuth(callback) {
  let unsubProfile = null;
  return onAuthStateChanged(auth, (user) => {
    // sgancia eventuale listener precedente quando cambia l’utente
    if (typeof unsubProfile === "function") { unsubProfile(); unsubProfile = null; }

    if (!user) {
      callback({ user: null, profile: null });
      return;
    }

    const ref = doc(db, "users", user.uid);
    unsubProfile = onSnapshot(
      ref,
      (snap) => {
        callback({ user, profile: snap.exists() ? snap.data() : null });
      },
      (err) => {
        console.error("[observeAuth] onSnapshot error:", err);
        callback({ user, profile: null });
      }
    );
  });
}
