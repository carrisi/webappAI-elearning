// src/teacher/TeacherApp.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import MyNavBarTeacher from '../components/MyNavBarTeacher';
import ChatBox from '../components/ChatBox';
import './Style/TeacherApp.css';

import heroImgLandingTeacher from '../assets/images/hero-illustration-TeacherApp.png';

export default function TeacherApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/docente';

  // Allineiamo l'altezza della chat all'immagine sticky (come StudentApp)
  const imgRef = useRef(null);
  const [chatHeight, setChatHeight] = useState(420);

  useEffect(() => {
    const updateFromImg = () => {
      if (imgRef.current) {
        const h = Math.round(imgRef.current.getBoundingClientRect().height);
        if (h > 0) setChatHeight(h);
      }
    };
    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && imgRef.current) {
      ro = new ResizeObserver(() => updateFromImg());
      ro.observe(imgRef.current);
    }
    updateFromImg();
    window.addEventListener('resize', updateFromImg);
    return () => {
      window.removeEventListener('resize', updateFromImg);
      if (ro && imgRef.current) ro.unobserve(imgRef.current);
    };
  }, []);

  return (
    <>
      <MyNavBarTeacher />

      <main className={isLanding ? 'landing' : ''}>
        {isLanding ? (
          // ====== LAYOUT STICKY A DUE COLONNE ======
          <section className="landing-stickyLayout">
            {/* Colonna sinistra: contenuto completo */}
            <div className="landing-col-left">

              {/* HERO */}
              <div className="landing-hero">
                <div className="landing-hero-inner">
                  <h1 className="landing-title">Insegna in modo più smart</h1>
                  <p className="landing-subtitle">
                    Centralizza corsi, lezioni, materiali e valutazioni. L’AI ti aiuta a creare contenuti,
                    rispondere ai dubbi e monitorare l’andamento della classe.
                  </p>
                  <div className="landing-cta">
                    <button
                      className="landing-btn primary"
                      onClick={() => navigate('/docente/corsi')}
                    >
                      I miei corsi
                    </button>
                    <button
                      className="landing-btn outline"
                      onClick={() => navigate('/docente/corsi/nuovo')}
                    >
                      Crea nuovo corso
                    </button>
                  </div>
                </div>
              </div>

              {/* DEMO CHAT (stesso wrapper e stile della landing studente) */}
              <div className="landing-demo" id="demo">
                <h2 className="landing-title">Assistente Docente AI</h2>
                <p className="landing-subtitle">
                  Chiedi di generare quiz dalle tue slide, riassunti di PDF, o risposte alle FAQ degli studenti.
                </p>
                <div className="chat-container">
                  <ChatBox variant="standalone" showHeader placeholder="Chiedi alla ChatAI..." />
                </div>

              </div>

              {/* BENEFICI DOCENTE */}
              <section className="landing-section landing-benefits">
                <h2 className="landing-heading">Benefici per il docente</h2>
                <ul className="landing-benefitList">
                  <li>🧠 Generazione rapida di quiz, riassunti e materiali</li>
                  <li>📈 Insight su domande e difficoltà più frequenti</li>
                  <li>⏱ Meno tempo su email/FAQ ripetitive</li>
                  <li>🤝 Collaborazione con tutor e co-docenti</li>
                </ul>
              </section>

              {/* CARATTERISTICHE */}
              <section className="landing-section landing-features">
                <h2 className="landing-heading">Cosa puoi fare</h2>
                <div className="landing-featureGrid">
                  <div className="landing-featureCard">📚 Gestione corsi e lezioni</div>
                  <div className="landing-featureCard">📤 Upload e organizzazione materiali</div>
                  <div className="landing-featureCard">📝 Valutazioni e feedback</div>
                  <div className="landing-featureCard">🤖 Generazione quiz/riassunti (AI)</div>
                </div>
              </section>

              {/* CTA secondaria / FAQ docente */}
              <section className="landing-section landing-faq">
                <h2 className="landing-heading">Domande frequenti</h2>
                <details className="landing-faqItem">
                  <summary>Come creo un corso?</summary>
                  <p>Vai su “I miei corsi” e premi “Crea nuovo corso”. Potrai aggiungere sezioni, lezioni e materiali.</p>
                </details>
                <details className="landing-faqItem">
                  <summary>Come genero un quiz dalle slide?</summary>
                  <p>Apri la lezione, carica le slide e usa l’assistente AI per generare domande a risposta multipla.</p>
                </details>
                <details className="landing-faqItem">
                  <summary>Posso pubblicare bozze in privato?</summary>
                  <p>Sì, ogni lezione può restare in bozza finché non la pubblichi agli studenti.</p>
                </details>

                <div className="landing-faqButtonWrapper">
                  <button
                    className="landing-btn primary"
                    onClick={() => navigate('/docente/faq')}
                  >
                    Vai alla sezione FAQ Docente
                  </button>
                </div>
              </section>
            </div>

            {/* Colonna destra: illustrazione sticky */}
            <div className="landing-col-right">
              <div className="landing-imageCard">
                <img
                  ref={imgRef}
                  src={heroImgLandingTeacher}
                  alt="Docente che gestisce corsi e materiali"
                />
              </div>
            </div>
          </section>
        ) : (
          // Sottopagine future (dashboard/corsi/lezioni/materiali/valutazioni)
          <Outlet />
        )}
      </main>
    </>
  );
}
