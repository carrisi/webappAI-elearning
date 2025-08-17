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
          <Card.Title className="courseTitle mb-1" id='title'>{corso.titolo}</Card.Title>
          <div className="small text-muted mb-2">Docente: {corso.instructor}</div>

          {corso.descrizione && (
            <Card.Text className="mb-3">{corso.descrizione}</Card.Text>
          )}

          {/* 1) Dettagli */}
          <div className="course-meta mb-2">
            {Number.isFinite(corso?.introduzione?.credits) && (
              <Badge bg="light" text="dark">{corso.introduzione.credits} CFU</Badge>
            )}
            {corso?.introduzione?.semester && (
              <Badge bg="light" text="dark">{corso.introduzione.semester}</Badge>
            )}
          </div>

          {/* 2) Hashtag */}
          <div className="course-tags">
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
      <h2 id="myCourses">I miei corsi</h2>
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
