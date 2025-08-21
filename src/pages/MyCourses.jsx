// src/pages/MyCourses.jsx
import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import mockCourses from '../data/mockCourses';
import '../pages/Style/MyCourses.css';

function CourseCard({ corso }) {
  return (
    <Link to={`/studente/corsi/${corso.id}`} className="text-decoration-none">
      <Card className="h-100 glass-card clickable-card">
        <Card.Body>
          <Card.Title className="courseTitle mb-1" id="title">{corso.titolo}</Card.Title>
          <div className="small text-muted mb-2">Docente: {corso.instructor}</div>

          {corso.descrizione && (
            <Card.Text className="mb-3">{corso.descrizione}</Card.Text>
          )}

          {/* 1) Dettagli */}
          <div className="course-meta mb-2 d-flex gap-2 flex-wrap">
            {Number.isFinite(corso?.introduzione?.credits) && (
              <Badge bg="light" text="dark">{corso.introduzione.credits} CFU</Badge>
            )}
            {corso?.introduzione?.semester && (
              <Badge bg="light" text="dark">{corso.introduzione.semester}</Badge>
            )}
          </div>

          {/* 2) Hashtag */}
          <div className="course-tags d-flex gap-2 flex-wrap">
            {(corso.tags || []).slice(0, 6).map(t => (
              <Badge key={t} bg="light" text="dark">#{t}</Badge>
            ))}
          </div>
        </Card.Body>

        <Card.Footer>
          <small className="text-muted">
            {corso.stato === 'attivo' ? 'In corso' : 'Completato'}
          </small>
        </Card.Footer>
      </Card>
    </Link>
  );
}

export default function MyCourses() {
  return (
    <Container className="py-4">
      {/* HERO con glassmorphism */}
      <section className="glass-hero text-white mb-5">
        <h1 className="fw-bold hero-title">I miei corsi</h1>
        <p className="hero-subtitle">
          Gestisci le iscrizioni, monitora i progressi e accedi ai materiali
          quando vuoi.
        </p>
        <div className="hero-actions d-flex justify-content-center flex-wrap gap-2">
          <Link to="/studente/scopri" className="landing-btn primary">Scopri nuovi corsi</Link>
          <Link to="/studente/profilo" className="landing-btn outline">Visualizza profilo</Link>
        </div>
      </section>

      {/* Lista corsi */}
      <Row className="g-3">
        {mockCourses.map(corso => (
          <Col key={corso.id} xs={12} md={6} lg={4}>
            <CourseCard corso={corso} />
          </Col>
        ))}
        {mockCourses.length === 0 && (
          <Col><p>Non sei iscritto a nessun corso.</p></Col>
        )}
      </Row>
    </Container>
  );
}
