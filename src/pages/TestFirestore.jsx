import { useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function TestFirestore() {
  useEffect(() => {
    async function run() {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.log("⚠️ Non sei loggato. Prima effettua il login!");
        return;
      }

      // ✅ Test scrittura/lettura del proprio profilo
      try {
        await setDoc(
          doc(db, "users", uid),
          { check: "ok", t: Date.now() },
          { merge: true }
        );
        const snap = await getDoc(doc(db, "users", uid));
        console.log("✅ Lettura del proprio profilo riuscita:", snap.data());
      } catch (err) {
        console.error("❌ Errore scrivendo/leggendo il proprio profilo:", err);
      }

      // ❌ Test lettura profilo di un altro uid (DEVE FALLIRE con permission-denied)
      try {
        const snapOther = await getDoc(doc(db, "users", "someOtherUid"));
        console.log("Altro utente (non dovrebbe riuscire):", snapOther.exists());
      } catch (err) {
        console.error("✅ Errore atteso leggendo altro utente:", err.code);
      }
    }

    run();
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Test Firestore</h1>
      <p>Guarda la console del browser (DevTools → Console) per i risultati.</p>
    </main>
  );
}
