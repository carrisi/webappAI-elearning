// src/teacher/pages/TeacherCourses.jsx
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { listMyCourses } from "../services/courses";
import './Style/TeacherCourses.css';

function CourseCard({ corso }) {
  return (
    <Link to={`/docente/corsi/${corso.id}`} className="text-decoration-none">
      <Card className="h-100 glass-card clickable-card">
        <Card.Body>
          <Card.Title className="courseTitle mb-1" id="title">{corso.titolo}</Card.Title>
          <div className="small text-muted mb-2">Iscritti: — {/* hook al backend in futuro */}</div>

          {corso.descrizione && (
            <Card.Text className="mb-3 course-card-description">{corso.descrizione}</Card.Text>
          )}

          {/* Dettagli coerenti con lo studente */}
          <div className="course-meta mb-2 d-flex gap-2 flex-wrap">
            {Number.isFinite(corso?.introduzione?.credits) && (
              <Badge bg="light" text="dark">{corso.introduzione.credits} CFU</Badge>
            )}
            {corso?.introduzione?.semester && (
              <Badge bg="light" text="dark">{corso.introduzione.semester}</Badge>
            )}
          </div>

          {/* Hashtag/tags: opzionale lato docente */}
          <div className="course-tags d-flex gap-2 flex-wrap">
            {/* tag lato docente in step successivo */}
          </div>
        </Card.Body>

        <Card.Footer>
          <small className="text-muted">
            {corso.stato.charAt(0).toUpperCase() + corso.stato.slice(1)}
          </small>
        </Card.Footer>
      </Card>
    </Link>
  );
}

export default function TeacherCourses() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const q = (params.get('q') || '').toLowerCase();

const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  let alive = true;
  listMyCourses()
    .then(rows => { if (alive) setItems(rows); })
    .finally(() => { if (alive) setLoading(false); });
  return () => { alive = false; };
}, []);

 const filtered = items.filter(c =>
  [c.titolo, c.descrizione, c?.introduzione?.professor, c?.introduzione?.semester, String(c?.introduzione?.credits)]
    .join(' ')
    .toLowerCase()
    .includes(q)
);

  return (
    <Container className="py-4">
      {/* HERO glass identico allo studente (copy docente) */}
      <section className="glass-hero text-white mb-5">
        <h1 className="fw-bold hero-title">I miei corsi</h1>
        <p className="hero-subtitle">
          Crea, organizza e aggiorna i tuoi corsi. Aggiungi lezioni e materiali in pochi clic.
        </p>
        <div className="hero-actions d-flex justify-content-center flex-wrap gap-2">
          <Link to="/docente/corsi/nuovo" className="landing-btn primary">+ Crea nuovo corso</Link>
        </div>
      </section>

      {/* Lista corsi */}
      <Row className="g-3">
        {loading && <Col><p className="text-white-50">Caricamento corsi…</p></Col>}
        {!loading && filtered.map(corso => (
          <Col key={corso.id} xs={12} md={6} lg={4}>
            <CourseCard corso={corso} />
          </Col>
        ))}
        {filtered.length === 0 && (
          <Col><p className="text-white-50">Nessun corso trovato.</p></Col>
        )}
      </Row>
    </Container>
  );
}
