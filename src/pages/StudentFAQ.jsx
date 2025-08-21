// src/pages/StudentFAQ.jsx
import React, { useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Style/StudentFAQ.css';
import './Style/MyCourses.css'; // per .landing-btn primary/outline

export default function StudentFAQ() {
  // 10 FAQ (include le 3 della landing)
  const faqs = useMemo(() => ([
    { q: 'I dati sono sicuri?',
      a: 'Sì. I materiali sono trattati secondo le normative sulla privacy e non vengono condivisi senza il tuo consenso.' },
    { q: 'Posso caricare qualsiasi tipo di file?',
      a: 'Supportiamo PDF, video, slide e testi. Altri formati (immagini, ZIP) stanno arrivando.' },
    { q: 'È compatibile con il mio corso?',
      a: 'Sì, la webapp è pensata per corsi universitari e scolastici di qualunque disciplina.' },
    { q: 'Come funziona la chat AI sui materiali?',
      a: 'Carichi i tuoi contenuti (PDF, slide, video) e fai domande in linguaggio naturale. Le risposte citano i passaggi rilevanti e tengono il contesto.' },
    { q: 'Come vedo i corsi a cui sono iscritto?',
      a: 'Vai su “I miei corsi”: trovi stato (in corso, completato), progressi e link rapidi alle lezioni.' },
    { q: 'Posso usare l’app da mobile?',
      a: 'Certo. L’interfaccia è responsive e sono supportati i principali browser mobile.' },
    { q: 'Come cambio email, username o password?',
      a: 'Apri “Profilo” → “Impostazioni”. Puoi aggiornare anagrafica, preferenze, avatar e password.' },
    { q: 'Non vedo un corso nel catalogo. Cosa faccio?',
      a: 'Usa “Scopri” per cercare per titolo/docente/tag. Se non compare, invia una richiesta o contatta il supporto.' },
    { q: 'Come vengono calcolati i miei progressi?',
      a: 'Ogni lezione completata aggiorna la percentuale. Alcuni corsi includono quiz che pesano sulla progressione.' },
    { q: 'Come contatto il supporto?',
      a: 'Dal menu “Profilo” → “Supporto”. In alternativa, apri un ticket dalla pagina del corso.' },
  ]), []);

  // JSON‑LD per accessibilità/SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a }
    }))
  };

  return (
    <div className="student-faq-page">
      <Container className="px-0">

        {/* HERO */}
        <header className="faq-hero glass-hero">
          <h1 className="faq-title">Domande frequenti</h1>
          <p className="faq-sub">Risposte rapide su corsi, chat AI e gestione del profilo.</p>
          <div className="faq-cta">
            <Link to="/studente/corsi" className="landing-btn primary">I miei corsi</Link>
            <Link to="/studente" className="landing-btn outline">HomePage</Link>
          </div>
        </header>

        {/* ACCORDION stile landing */}
        <section className="faq-accordion">
          {faqs.map(({ q, a }, i) => (
            <details className="faq-item" key={i}>
              <summary className="faq-summary">
                <span className="faq-q">{q}</span>
                <span className="chev" aria-hidden>▸</span>
              </summary>
              <div className="faq-answer">{a}</div>
            </details>
          ))}
        </section>

        {/* BLOCCO AIUTO */}
        <section className="faq-help glass-block">
          <h2 className="faq-help-title">Non hai trovato quello che cercavi?</h2>
          <p className="faq-help-text">
            Vai su <Link to="/supporto">Supporto</Link> oppure apri un ticket dalla pagina del corso.
          </p>
        </section>
      </Container>

      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
