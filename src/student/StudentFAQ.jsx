// src/pages/StudentFAQ.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Style/StudentFAQ.css";
import "./Style/MyCourses.css"; // per .landing-btn

// Contenuti: riuso le FAQ lato studente esistenti, mappate su categorie
const FAQS = [
  { id: "sicurezza-dati", category: "Account & Privacy",
    q: "I dati sono sicuri?",
    a: "Sì. I materiali sono trattati secondo le normative sulla privacy e non vengono condivisi senza il tuo consenso.",
    chips: ["privacy", "dati", "sicurezza"] },

  { id: "tipi-file", category: "Materiali",
    q: "Posso caricare qualsiasi tipo di file?",
    a: "Supportiamo PDF, video, slide e testi. Altri formati (immagini, ZIP) stanno arrivando.",
    chips: ["pdf", "video", "slide"] },

  { id: "compatibilita", category: "Corsi",
    q: "È compatibile con il mio corso?",
    a: "Sì, la webapp è pensata per corsi universitari e scolastici di qualunque disciplina.",
    chips: ["corsi", "discipline"] },

  { id: "chatai-materiali", category: "AI",
    q: "Come funziona la chat AI sui materiali?",
    a: "Carichi i tuoi contenuti (PDF, slide, video) e fai domande in linguaggio naturale. Le risposte citano i passaggi rilevanti e tengono il contesto.",
    chips: ["ai", "pdf", "slide"] },

  { id: "iscrizioni", category: "Corsi",
    q: "Come vedo i corsi a cui sono iscritto?",
    a: "Vai su “I miei corsi”: trovi stato (in corso, completato), progressi e link rapidi alle lezioni.",
    chips: ["iscrizioni", "progressi"] },

  { id: "mobile", category: "App & Accesso",
    q: "Posso usare l’app da mobile?",
    a: "Certo. L’interfaccia è responsive e sono supportati i principali browser mobile.",
    chips: ["mobile", "responsive"] },

  { id: "profilo-sicurezza", category: "Account & Privacy",
    q: "Come cambio email, username o password?",
    a: "Apri “Profilo” → “Impostazioni”. Puoi aggiornare anagrafica, preferenze, avatar e password.",
    chips: ["profilo", "password", "email"] },

  { id: "catalogo", category: "Corsi",
    q: "Non vedo un corso nel catalogo. Cosa faccio?",
    a: "Usa “Scopri” per cercare per titolo/docente/tag. Se non compare, invia una richiesta o contatta il supporto.",
    chips: ["catalogo", "ricerca"] },

  { id: "progressi", category: "Corsi",
    q: "Come vengono calcolati i miei progressi?",
    a: "Ogni lezione completata aggiorna la percentuale. Alcuni corsi includono quiz che pesano sulla progressione.",
    chips: ["progressi", "quiz"] },

  { id: "supporto", category: "Supporto",
    q: "Come contatto il supporto?",
    a: "Dal menu “Profilo” → “Supporto”. In alternativa, apri un ticket dalla pagina del corso.",
    chips: ["supporto", "ticket"] },
];

const CATEGORIES = ["Tutte", "AI", "Corsi", "Materiali", "App & Accesso", "Account & Privacy", "Supporto"];

export default function StudentFAQ() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Tutte");
  const [openId, setOpenId] = useState(null);

  // supporto deep-link: /studente/faq#id-faq
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
        <h1 className="faq-title">FAQ Studente</h1>
        <p className="faq-subtitle">Risposte rapide su corsi, ChatAI e gestione del profilo.</p>

        <form className="faq-search" onSubmit={(e)=>e.preventDefault()}>
          <input
            type="search"
            className="faq-input"
            placeholder='Cerca (es. "AI", "PDF", "iscrizioni")'
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

                {/* chip di supporto come teacher */}
                <div className="chips">
                  {item.chips.map((c,i)=>(
                    <span className="mini-chip" key={i}>#{c}</span>
                  ))}
                </div>

                {/* link utili (facoltativi) */}
                <div className="deep-link">
                  {item.id === "iscrizioni" && (
                    <Link to="/studente/corsi" className="landing-btn outline">I miei corsi</Link>
                  )}
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
