// Importa la init di base
import { initializeApp } from "firebase/app";

// Se ti serve l’autenticazione
import { getAuth, setPersistence, browserLocalPersistence, } from "firebase/auth";

// Se ti serve il database Firestore
import { getFirestore } from "firebase/firestore";

// Incolla qui i valori dal tuo progetto Firebase
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  // storageBucket:  import.meta.env...
};

// Inizializza l’app
const app = initializeApp(firebaseConfig);

// Mantieni la sessione fintanto che l’utente non esce
export const auth = getAuth(app);
await setPersistence(auth, browserLocalPersistence);

// Firestore per i profili/ruoli
export const db = getFirestore(app);

export default app;