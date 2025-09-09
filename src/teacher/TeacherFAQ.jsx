// src/teacher/TeacherFAQ.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Style/TeacherFAQ.css";

const FAQS = [
  {
    id: "crea-corso",
    category: "Corsi & Lezioni",
    q: "Come creo un nuovo corso?",
    a: "Vai su “Corsi” e clicca su “Crea nuovo corso”. Inserisci titolo, obiettivi, programma e aggiungi le lezioni. Puoi lasciare il corso in bozza e pubblicarlo quando è pronto.",
    chips: ["corso", "lezioni", "bozza", "pubblicazione"]
  },
  {
    id: "gestione-lezioni",
    category: "Corsi & Lezioni",
    q: "Posso duplicare o riordinare le lezioni?",
    a: "Sì. Dalla scheda del corso puoi duplicare una lezione esistente e trascinarla per cambiare l’ordine.",
    chips: ["lezioni", "duplicazione", "riordinare"]
  },
  {
    id: "materiali-upload",
    category: "Materiali",
    q: "Che tipi di materiali posso caricare?",
    a: "PDF, slide, immagini e video. I materiali vengono organizzati per corso/lezione e puoi renderli visibili o nascosti agli studenti.",
    chips: ["pdf", "slide", "video", "visibilità"]
  },
  {
    id: "limiti-upload",
    category: "Materiali",
    q: "Ci sono limiti di dimensione per i file?",
    a: "Ogni file può avere massimo 100MB. Per video più lunghi ti consigliamo di caricarli su YouTube non in elenco e inserire il link.",
    chips: ["limiti", "upload", "video", "dimensione"]
  },
  {
    id: "quiz-ai",
    category: "AI",
    q: "Come genero quiz dalle slide con l’AI?",
    a: "Apri la lezione, carica le slide etichettandole come materiali. Nella ChatAI usa il prompt “Genera quiz” specificando numero di domande e livello di difficoltà.",
    chips: ["quiz", "ai", "slide", "domande"]
  },
  {
    id: "riassunti-ai",
    category: "AI",
    q: "Posso ottenere riassunti dei PDF?",
    a: "Sì. Allegando il PDF alla lezione puoi chiedere alla ChatAI di sintetizzarlo in punti chiave e generare domande di verifica.",
    chips: ["riassunto", "pdf", "verifica"]
  },
  {
    id: "faq-studenti",
    category: "AI",
    q: "L’AI può rispondere alle FAQ degli studenti?",
    a: "Creando una knowledge base con i materiali del corso, la ChatAI può fornire risposte automatiche. Puoi approvarle prima della pubblicazione.",
    chips: ["faq", "ai", "studenti"]
  },
  {
    id: "personalizzazione-ai",
    category: "AI",
    q: "Posso personalizzare il comportamento dell’AI?",
    a: "Sì. Dalle impostazioni del corso puoi aggiungere linee guida personalizzate che l’AI seguirà nelle risposte.",
    chips: ["ai", "personalizzazione", "impostazioni"]
  },
  {
    id: "valutazioni",
    category: "Valutazioni",
    q: "Come registro valutazioni e pesi?",
    a: "Dalla pagina Valutazioni puoi creare esami, esoneri o esercitazioni. Ogni valutazione ha peso, data e range voto.",
    chips: ["esami", "esoneri", "pesi"]
  },
  {
    id: "esportazione-valutazioni",
    category: "Valutazioni",
    q: "Posso esportare le valutazioni?",
    a: "Sì. È disponibile l’esportazione in formato CSV per importarle in Excel o altri sistemi.",
    chips: ["csv", "esportazione", "valutazioni"]
  },
  {
    id: "ruoli",
    category: "Account & Ruoli",
    q: "Posso collaborare con tutor o co-docenti?",
    a: "Sì. Aggiungi i collaboratori nelle impostazioni del corso e assegna permessi granulari.",
    chips: ["collaboratori", "permessi", "tutor"]
  },
  {
    id: "privacy",
    category: "Account & Ruoli",
    q: "Come gestite privacy e sicurezza dei dati?",
    a: "I materiali restano confinati al tuo corso. Puoi revocare l’accesso e cancellare i dati in ogni momento.",
    chips: ["privacy", "sicurezza", "dati"]
  },
  {
    id: "supporto",
    category: "Supporto",
    q: "Come posso ricevere supporto tecnico?",
    a: "Puoi consultare queste FAQ, usare la ChatAI o aprire un ticket nella sezione Impostazioni → Supporto.",
    chips: ["supporto", "ticket", "assistenza"]
  }
];

const CATEGORIES = ["Tutte", "AI", "Corsi & Lezioni", "Materiali", "Valutazioni", "Account & Ruoli"];

export default function TeacherFAQ() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Tutte");
  const [openId, setOpenId] = useState(null);

  // apri la faq dall’ancora: es. /docente/faq#quiz-ai
  useEffect(() => {
    const hash = location.hash?.replace("#", "");
    if (hash) setOpenId(hash);
  }, [location.hash]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter(item => {
      const inCat = activeCat === "Tutte" || item.category === activeCat;
      if (!q) return inCat;
      const hay = (item.q + " " + item.a + " " + item.chips.join(" ")).toLowerCase();
      return inCat && hay.includes(q);
    });
  }, [query, activeCat]);

  const onToggle = (id) => setOpenId(prev => (prev === id ? null : id));

  return (
    <main className="faq">
      <header className="faq-header">
        <h1 className="faq-title">FAQ Docente</h1>
        <p className="faq-subtitle">Risposte rapide su corsi, materiali, AI e valutazioni.</p>
        <form className="faq-search" onSubmit={(e)=>e.preventDefault()}>
          <input
            type="search"
            className="faq-input"
            placeholder="Cerca (es. “quiz AI”, “PDF”, “valutazioni”)"
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            aria-label="Cerca nelle FAQ"
          />
        </form>
        <nav className="faq-cats" aria-label="Categorie FAQ">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              className={`chip ${cat === activeCat ? "active" : ""}`}
              onClick={()=>setActiveCat(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>
      </header>

      <section className="faq-list" aria-live="polite">
        {filtered.length === 0 && (
          <div className="faq-empty">Nessun risultato. Prova con termini diversi o cambia categoria.</div>
        )}
        {filtered.map(item => {
          const isOpen = openId === item.id;
          return (
            <article key={item.id} id={item.id} className={`faq-item ${isOpen ? "open" : ""}`}>
              <button
                className="faq-question"
                aria-expanded={isOpen}
                aria-controls={`${item.id}-panel`}
                onClick={()=>onToggle(item.id)}
              >
                <span className="q">{item.q}</span>
                <span className="icon" aria-hidden="true">{isOpen ? "–" : "+"}</span>
              </button>
              <div
                id={`${item.id}-panel`}
                role="region"
                aria-labelledby={item.id}
                className="faq-answer"
                style={{ display: isOpen ? "block" : "none" }}
              >
                <p>{item.a}</p>
                <div className="chips">
                  {item.chips.map((c,i)=>(
                    <span className="mini-chip" key={i}>#{c}</span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <footer className="faq-footer">
        <p>Non hai trovato la risposta? Vai alla ChatAI e fai la tua domanda.</p>
      </footer>
    </main>
  );
}
