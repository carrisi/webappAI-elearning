// src/teacher/pages/TeacherCourseDashboard.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import ChatBox from '../components/ChatBox';
import teacherCourses from '../data/teacherCoursesMock';
import './Style/TeacherCourseDashboard.css';
import './Style/TeacherCourses.css'; // per glass-card/hero coerenti

export default function TeacherCourseDashboard() {
  const { courseId } = useParams();
  const corso = teacherCourses.find(c => String(c.id) === String(courseId));

  if (!corso) {
    return (
      <Container className="py-5">
        <div className="cd-not-found">
          <h2 className="text-white">Corso non trovato</h2>
          <p className="text-white-50">Controlla l’URL o torna all’elenco corsi.</p>
          <Link to="/docente/corsi" className="landing-btn outline">← Torna ai corsi</Link>
        </div>
      </Container>
    );
  }

  // Mock KPI per corso (collega poi al backend/AI)
  const kpi = [
    { label: 'Domande AI (30gg)', value: 42 },
    { label: 'Argomenti con lacune', value: 3 },
    { label: 'Segnalazioni materiali', value: 2 },
    { label: 'Studenti a rischio', value: 5 },
  ];

  // Mock insight (collega poi a data reale)
  const topQuestions = [
    'Differenza tra O(n) e O(log n) negli algoritmi',
    'Ricorsione: casi base e profondità massima',
    'Come normalizzare un database (3NF)?'
  ];
  const weakTopics = ['Ricorsione', 'Complessità logaritmica', 'Join SQL'];
  const materialFlags = [
    'Slide Lezione 3: ref mancante alla slide 12',
    'PDF Lezione 5: formulazione ambigua a pag. 7'
  ];

  return (
    <Container className="teacher-course-dashboard py-4">
      {/* HERO con titolo corso (stile glass identico) */}
      <section className="glass-hero text-white mb-4">
        <h1 className="hero-title mb-1">{corso.titolo}</h1>
        {corso.descrizione && <p className="hero-subtitle mb-2">{corso.descrizione}</p>}

        <div className="d-flex gap-2 flex-wrap justify-content-center mt-2">
          {Number.isFinite(corso?.introduzione?.credits) && (
            <Badge bg="light" text="dark">{corso.introduzione.credits} CFU</Badge>
          )}
          {corso?.introduzione?.semester && (
            <Badge bg="light" text="dark">{corso.introduzione.semester}</Badge>
          )}
          <Badge bg="light" text="dark">{corso.stato === 'attivo' ? 'Pubblicato' : 'Bozza'}</Badge>
        </div>

        <div className="hero-actions d-flex justify-content-center flex-wrap gap-2 mt-3">
          <Link to={`/docente/corsi/${corso.id}`} className="landing-btn outline">Apri dettaglio corso</Link>
          <Link to={`/docente/corsi/${corso.id}/modifica`} className="landing-btn primary">Modifica corso</Link>
        </div>
      </section>

      {/* 1) KPI corso */}
      <section aria-labelledby="kpiTitle" className="mb-4">
        <h2 id="kpiTitle" className="dash-heading">Panoramica corso</h2>
        <Row className="g-3">
          {kpi.map((item, i) => (
            <Col key={i} xs={6} md={3}>
              <Card className="glass-card kpi-card h-100">
                <Card.Body>
                  <div className="kpi-value">{item.value}</div>
                  <div className="kpi-label">{item.label}</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* 2) ChatAI contestuale al corso */}
      <section aria-labelledby="chatTitle" className="mb-4">
        <h2 id="chatTitle" className="dash-heading">ChatAI del corso</h2>
        <Row className="g-3 align-items-stretch">
          <Col xs={12} lg={7}>
            <Card className="glass-card chat-panel h-100">
              <Card.Body className="p-0">
                <div className="chat-container">
                  <ChatBox />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} lg={5}>
            <Card className="glass-card h-100">
              <Card.Body>
                <h5 className="mb-3">Prompt veloci (corso)</h5>
                <ul className="quick-prompts">
                  <li>“Riassumi i punti chiave della Lezione 2.”</li>
                  <li>“Genera 8 quiz MCQ dalla Sezione 1 con soluzione.”</li>
                  <li>“Mostra gli argomenti con più domande negli ultimi 7 giorni.”</li>
                  <li>“Suggerisci esercizi per colmare le lacune su <em>{weakTopics[0]}</em>.”</li>
                </ul>

                <h6 className="mt-4">Azioni rapide</h6>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  <Link to={`/docente/corsi/${corso.id}/modifica`} className="landing-btn outline">Modifica materiale</Link>
                  <Button variant="light" className="landing-btn outline">Crea quiz</Button>
                  <Button variant="light" className="landing-btn outline">Genera riassunto</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      {/* 3) Insight AI del corso */}
      <section aria-labelledby="insightTitle" className="mb-5">
        <h2 id="insightTitle" className="dash-heading">Insight AI del corso</h2>
        <Row className="g-3">
          {/* Domande più frequenti */}
          <Col xs={12} md={6}>
            <Card className="glass-card h-100">
              <Card.Body>
                <h5>Domande più frequenti</h5>
                <ol className="mb-0">
                  {topQuestions.map((q, i) => <li key={i}>{q}</li>)}
                </ol>
              </Card.Body>
            </Card>
          </Col>

          {/* Argomenti con lacune */}
          <Col xs={12} md={6}>
            <Card className="glass-card h-100">
              <Card.Body>
                <h5>Argomenti con lacune</h5>
                <ul className="mb-0">
                  {weakTopics.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </Card.Body>
            </Card>
          </Col>

          {/* Qualità materiali */}
          <Col xs={12} md={6}>
            <Card className="glass-card h-100">
              <Card.Body>
                <h5>Qualità dei materiali</h5>
                <ul className="mb-0">
                  {materialFlags.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </Card.Body>
            </Card>
          </Col>

          {/* Placeholder grafici */}
          <Col xs={12} md={6}>
            <Card className="glass-card h-100">
              <Card.Body>
                <h5>Trend domande per lezione</h5>
                <p className="mb-0 text-white-50">[Grafico line/area – integrazione successiva]</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
}
