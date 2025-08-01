// src/pages/MyCourses.jsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import mockCourses from '../data/mockCourses';
import '../pages/Style/MyCourses.css';

function CourseCard({ corso }) {
  return (
    <Link
      to={`/studente/corsi/${corso.id}`}
      className="text-decoration-none"
    >
      <Card className="h-100 glass-card clickable-card">
        <Card.Body>
          <Card.Title className='courseTitle'>{corso.titolo}</Card.Title>
          <Card.Text>{corso.descrizione}</Card.Text>
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
      <h2 id='myCourses'>I miei corsi</h2>
      <Row className="g-3">
        {mockCourses.map(corso => (
          <Col key={corso.id} xs={12} md={6} lg={4}>
            <CourseCard corso={corso} />
          </Col>
        ))}

        {mockCourses.length === 0 && (
          <Col>
            <p>Non sei iscritto a nessun corso.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}
