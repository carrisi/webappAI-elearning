// src/pages/MyCourses.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Style/MyCourses.css';

import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { listMyEnrollments } from '../services/enrollments'; // legge /enrollments per lo user corrente

function CourseCard({ corso }) {
  return (
    <Link to={`/studente/corsi/${corso.id}`} className="text-decoration-none">
      <Card className="h-100 glass-card clickable-card">
        <Card.Body>
          <Card.Title className="courseTitle mb-1" id="title">{corso.titolo}</Card.Title>
          <div className="small text-muted mb-2">Docente: {corso.instructor}</div>

          {corso.descrizione && (
            <Card.Text className="course-card-description mb-3">{corso.descrizione}</Card.Text>
          )}

          {/* 1) Dettagli */}
          <div className="course-meta mb-2 d-flex gap-2 flex-wrap">
            {Number.isFinite(Number(corso?.introduzione?.credits)) && (
              <Badge bg="light" text="dark">{Number(corso.introduzione.credits)} CFU</Badge>
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
            {corso.stato === 'completato' ? 'Completato' : 'In corso'}
          </small>
        </Card.Footer>
      </Card>
    </Link>
  );
}

export default function MyCourses() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // 1) prendo le mie iscrizioni
        const enrolls = await listMyEnrollments(); // restituisce tutte; filtro active
        const active = (enrolls || []).filter(e => e.status === 'active');

        if (active.length === 0) {
          if (!alive) return;
          setCourses([]);
          return;
        }

        // 2) carico i corsi relativi
        const ids = Array.from(new Set(active.map(e => e.courseId)));
        const snaps = await Promise.all(ids.map(id => getDoc(doc(db, 'courses', id))));

        const loaded = snaps
          .filter(s => s.exists())
          .map(s => {
            const d = s.data() || {};
            // normalizzo i campi per l'UI esistente
            const introduzione = d.introduzione || {};
            const instructor =
              introduzione.professor || d.professor || '—';

            return {
              id: s.id,
              titolo: d.titolo || 'Corso senza titolo',
              descrizione: d.descrizione || '',
              stato: d.stato || 'attivo',
              tags: d.tags || [],
              introduzione: {
                ...introduzione,
                credits: Number(introduzione.credits ?? NaN),
                semester: introduzione.semester || d.semester || '',
              },
              instructor,
            };
          });

        if (!alive) return;
        setCourses(loaded);
      } catch (e) {
        console.error('MyCourses load error', e);
        if (!alive) return;
        setErr('Impossibile caricare i tuoi corsi.');
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

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
        {courses.map(corso => (
          <Col key={corso.id} xs={12} md={6} lg={4}>
            <CourseCard corso={corso} />
          </Col>
        ))}

        {!loading && !err && courses.length === 0 && (
          <Col><p>Non sei iscritto a nessun corso.</p></Col>
        )}

        {err && (
          <Col xs={12}>
            <div className="alert alert-danger glass-card m-0">{err}</div>
          </Col>
        )}
      </Row>
    </Container>
  );
}
