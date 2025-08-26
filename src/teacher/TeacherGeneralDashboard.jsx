// src/teacher/pages/TeacherDashboard.jsx
import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import teacherCourses from '../data/teacherCoursesMock';

// Stili: dashboard + (riuso stile card/hero identico a TeacherCourses)
import './Style/TeacherGeneralDashboard.css';
import './Style/TeacherCourses.css'; // mantiene glass-card/hero coerenti alle card corsi

export default function TeacherDashboard() {
  // KPI generali (mock)
  const kpi = [
    { label: 'Domande AI (30gg)', value: 185 },
    { label: 'Argomenti con lacune', value: 12 },
    { label: 'Segnalazioni materiali', value: 9 },
    { label: 'Studenti a rischio', value: 17 },
  ];

  // Insight globali (mock)
  const topQuestions = [
    'Differenza tra O(n) e O(log n) negli algoritmi',
    'Cos’è un Transformer nelle reti neurali?',
    'Come normalizzare un database (3NF)?',
  ];
  const weakTopics = ['Ricorsione', 'SQL avanzato', 'Backpropagation'];
  const materialFlags = [
    'Slide Algoritmi: errore slide 12',
    'PDF Basi di Dati: ref mancante pag. 7',
  ];

  return (
    <Container className="teacher-dashboard py-4">
      {/* HERO generale (glass come TeacherCourses) */}
      <section className="glass-hero text-white mb-4">
        <h1 className="hero-title mb-1">Dashboard Docente</h1>
        <p className="hero-subtitle mb-2">
          Panoramica delle attività, domande AI e insight dagli studenti
        </p>

        <div className="d-flex gap-2 flex-wrap justify-content-center mt-2">
          <Badge bg="light" text="dark">Docente attivo</Badge>
          <Badge bg="light" text="dark">Anno Accademico 2024/25</Badge>
        </div>

        <div className="hero-actions d-flex justify-content-center flex-wrap gap-2 mt-3">
          <Link to="/docente/corsi" className="landing-btn outline">Vai ai corsi</Link>
          <Link to="/docente/corsi/nuovo" className="landing-btn primary">Crea nuovo corso</Link>
        </div>
      </section>

      {/* KPI generali */}
      <section aria-labelledby="kpiTitle" className="mb-4">
        <h2 id="kpiTitle" className="dash-heading">Panoramica generale</h2>
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

      {/* ChatAI globale */}
      <section aria-labelledby="chatTitle" className="mb-4">
        <h2 id="chatTitle" className="dash-heading">ChatAI Globale</h2>
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
                <h5 className="mb-3">Prompt veloci</h5>
                <ul className="quick-prompts">
                  <li>“Riassumi i punti chiave delle ultime lezioni.”</li>
                  <li>“Genera 10 quiz MCQ dagli argomenti più chiesti.”</li>
                  <li>“Mostra trend domande degli ultimi 7 giorni.”</li>
                  <li>“Suggerisci esercizi per colmare le lacune su <em>{weakTopics[0]}</em>.”</li>
                </ul>

                <h6 className="mt-4">Azioni rapide</h6>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  <Link to="/docente/corsi" className="landing-btn outline">Gestisci corsi</Link>
                  <Button variant="light" className="landing-btn outline">Crea quiz</Button>
                  <Button variant="light" className="landing-btn outline">Genera riassunto</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      {/* I miei corsi — card identiche a TeacherCourses, con bottoni extra nel footer */}
      <section aria-labelledby="myCoursesTitle" className="mb-4">
        <h2 id="myCoursesTitle" className="dash-heading">I miei corsi</h2>
        <Row className="g-3">
          {teacherCourses.map(corso => (
            <Col key={corso.id} xs={12} md={6} lg={4}>
              {/* Struttura e classi identiche a TeacherCourses.CourseCard */}
              <Card className="h-100 glass-card clickable-card">
                <Card.Body>
                  <Card.Title className="courseTitle mb-1" id="title">
                    {corso.titolo}
                  </Card.Title>

                  <div className="small text-muted mb-2">
                    Iscritti: — {/* hook al backend in futuro */}
                  </div>

                  {corso.descrizione && (
                    <Card.Text className="mb-3">{corso.descrizione}</Card.Text>
                  )}

                  <div className="course-meta mb-2 d-flex gap-2 flex-wrap">
                    {Number.isFinite(corso?.introduzione?.credits) && (
                      <Badge bg="light" text="dark">{corso.introduzione.credits} CFU</Badge>
                    )}
                    {corso?.introduzione?.semester && (
                      <Badge bg="light" text="dark">{corso.introduzione.semester}</Badge>
                    )}
                  </div>

                  <div className="course-tags d-flex gap-2 flex-wrap">
                    {/* tag lato docente in step successivo */}
                  </div>
                </Card.Body>

                {/* Footer identico con stato + bottoni richiesti */}
                <Card.Footer className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                  <small className="text-muted">
                    {corso.stato.charAt(0).toUpperCase() + corso.stato.slice(1)}
                  </small>

                  <div className="d-flex gap-2 ms-auto">
                    <Link
                      to={`/docente/corsi/${corso.id}/dashboard`}
                      className="landing-btn primary"
                    >
                      Apri dashboard
                    </Link>
                    <Link
                      to={`/docente/corsi/${corso.id}`}
                      className="landing-btn outline"
                    >
                      Dettagli corso
                    </Link>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Insight AI */}
      <section aria-labelledby="insightTitle" className="mb-5">
        <h2 id="insightTitle" className="dash-heading">Insight AI</h2>
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

          {/* Segnalazioni materiali */}
          <Col xs={12} md={6}>
            <Card className="glass-card h-100">
              <Card.Body>
                <h5>Segnalazioni materiali</h5>
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
                <h5>Trend domande globali</h5>
                <p className="mb-0 text-white-50">[Grafico line/area – integrazione successiva]</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
}
