// src/pages/StudentApp.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import MyNavbar from '../components/MyNavBar';
import ChatBox from '../components/ChatBox';
import './Style/StenteApp.css';
import heroImgLanding from '../assets/images/hero-illustration-StudentApp.png';

export default function StudentApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/studente';

  // Ref all’illustrazione sticky (colonna destra) per allineare l’altezza della chat
  const imgRef = useRef(null);
  const [chatHeight, setChatHeight] = useState(420); // fallback iniziale

  useEffect(() => {
    const updateFromImg = () => {
      if (imgRef.current) {
        const h = Math.round(imgRef.current.getBoundingClientRect().height);
        if (h > 0) setChatHeight(h);
      }
    };
    // ResizeObserver per variazioni dinamiche
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
      <MyNavbar />
      <main className={isLanding ? 'landing' : ''}>
        {isLanding ? (
          // ====== LAYOUT STICKY A DUE COLONNE: SINISTRA (TUTTE LE SEZIONI), DESTRA (IMMAGINE STICKY) ======
          <section className="landing-stickyLayout">
            {/* Colonna sinistra: TUTTO il contenuto della landing */}
            <div className="landing-col-left">

              {/* HERO fullscreen (solo nel primo viewport) */}
              <div className="landing-hero">
                <div className="landing-hero-inner">
                  <h1 className="landing-title">Impara più velocemente</h1>
                  <p className="landing-subtitle">
                    L’AI risponde alle tue domande sui materiali del corso: PDF, slide e video.
                  </p>
                  <div className="landing-cta">
                    <button className="landing-btn primary" onClick={() => navigate('/studente/corsi')}>
                      I miei corsi
                    </button>
                    <button className="landing-btn outline" onClick={() => navigate('/studente/scopri')}>
                      Scopri nuovi corsi
                    </button>
                  </div>
                </div>
              </div>

              {/* DEMO CHAT – stesso stile visivo dell’Hero */}
              <div className="landing-demo" id="demo">
                <h2 className="landing-title">Prova la Chat AI</h2>
                <p className="landing-subtitle">
                  Scrivi una domanda come faresti al docente e ricevi risposte contestuali ai tuoi contenuti.
                </p>
                <div
                  className="landing-chat"
                  style={{
                    // desktop: stessa altezza dell’immagine sticky; mobile: auto
                    height: typeof window !== 'undefined' && window.innerWidth < 992 ? 'auto' : Math.min(chatHeight, 600)
                  }}
                >
                  <ChatBox />
                </div>
              </div>

              {/* BENEFICI */}
              <section className="landing-section landing-benefits">
                <h2 className="landing-heading">Benefici per lo studente</h2>
                <ul className="landing-benefitList">
                  <li>⏱ Risparmio di tempo nello studio</li>
                  <li>📚 Risposte contestuali ai propri materiali (PDF, video, slide)</li>
                  <li>🌙 Supporto 24/7 senza dipendere dal docente</li>
                  <li>🤝 Rivedi le domande frequenti degli altri studenti</li>
                </ul>
              </section>

              {/* CARATTERISTICHE */}
              <section className="landing-section landing-features">
                <h2 className="landing-heading">Caratteristiche principali</h2>
                <div className="landing-featureGrid">
                  <div className="landing-featureCard">📂 Materiali sempre disponibili</div>
                  <div className="landing-featureCard">💬 Domande in linguaggio naturale</div>
                  <div className="landing-featureCard">📱 Accedi da qualsiasi dispositivo</div>
                  <div className="landing-featureCard">💾 Progressi salvati automaticamente</div>
                </div>
              </section>

              {/* TESTIMONIANZE */}
              <section className="landing-section landing-testimonials">
                <h2 className="landing-heading">Cosa dicono gli studenti</h2>
                <div className="landing-testimonialsGrid">
                              
                  <figure className="landing-quote">
                    <blockquote>
                      “Maria, Informatica: -30% sui tempi di preparazione agli esami.”
                    </blockquote>
                    <figcaption>— Caso reale, sessione estiva</figcaption>
                  </figure>
                              
                  <figure className="landing-quote">
                    <blockquote>
                      “Con la chat AI mi sento seguito anche fuori dagli orari di lezione.”
                    </blockquote>
                    <figcaption>— Studente triennale</figcaption>
                  </figure>
                              
                  <figure className="landing-quote">
                    <blockquote>
                      “Grazie all’app ho capito meglio concetti complessi senza dover aspettare le esercitazioni.”
                    </blockquote>
                    <figcaption>— Marco, Ingegneria</figcaption>
                  </figure>
                              
                  <figure className="landing-quote">
                    <blockquote>
                      “Ho potuto ripassare le slide del corso con spiegazioni personalizzate, come se fosse un tutor privato.”
                    </blockquote>
                    <figcaption>— Giulia, Medicina</figcaption>
                  </figure>
                              
                  <figure className="landing-quote">
                    <blockquote>
                      “Finalmente posso studiare quando voglio: anche di notte ho sempre risposte puntuali.”
                    </blockquote>
                    <figcaption>— Luca, Economia</figcaption>
                  </figure>
                              
                  <figure className="landing-quote">
                    <blockquote>
                      “La funzione FAQ mi ha fatto risparmiare tempo, trovando subito le domande che facevano anche i miei colleghi.”
                    </blockquote>
                    <figcaption>— Sara, Giurisprudenza</figcaption>
                  </figure>
                              
                </div>
              </section>


              {/* FAQ */}
              <section className="landing-section landing-faq">
                <h2 className="landing-heading">FAQ</h2>
                <details className="landing-faqItem">
                  <summary>I dati sono sicuri?</summary>
                  <p>I materiali sono trattati secondo le normative sulla privacy e non sono condivisi senza consenso.</p>
                </details>
                <details className="landing-faqItem">
                  <summary>Posso caricare qualsiasi tipo di file?</summary>
                  <p>Supportiamo PDF, video, slide e testi. Altri formati arriveranno presto.</p>
                </details>
                <details className="landing-faqItem">
                  <summary>È compatibile con il mio corso?</summary>
                  <p>Sì, l’app si adatta a corsi universitari e scolastici di qualunque disciplina.</p>
                </details>

                {/* Bottone link alla pagina FAQ completa */}
                <div className="landing-faqButtonWrapper">
                  <button
                    className="landing-btn primary"
                    onClick={() => navigate('/studente/faq')}
                  >
                    Vai alla sezione FAQ
                  </button>
                </div>
              </section>
            </div>

            {/* Colonna destra: illustrazione sempre sticky rispetto a TUTTA la landing */}
            <div className="landing-col-right">
              <div className="landing-imageCard">
                <img ref={imgRef} src={heroImgLanding} alt="Studente che impara online" />
              </div>
            </div>
          </section>
        ) : (
          <Outlet />
        )}
      </main>
    </>
  );
}
