// Importa la init di base
import { initializeApp } from "firebase/app";

// Se ti serve l’autenticazione
import { getAuth } from "firebase/auth";

// Se ti serve il database Firestore
import { getFirestore } from "firebase/firestore";

// Incolla qui i valori dal tuo progetto Firebase
const firebaseConfig = {
  apiKey:            "AIzaSyDTTjgouDv3phem-_Ca0jUm9sk6zko7rFQ",
  authDomain:        "ai-learning-uniba.firebaseapp.com",
  projectId:         "ai-learning-uniba",
  storageBucket:     "ai-learning-uniba.firebasestorage.app",
  messagingSenderId: "986137106908",
  appId:             "1:986137106908:web:007191ea75c554bc129719",
  measurementId:     "G-HW8DWLF88D"
};

// Inizializza l’app
const app = initializeApp(firebaseConfig);

// Esporta i servizi che userai nel resto della app
export const auth = getAuth(app);
export const db   = getFirestore(app);