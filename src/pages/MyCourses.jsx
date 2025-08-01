// src/pages/MyCourses.jsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import mockCourses from '../data/mockCourses';
import './Style/MyCourses.css'

function CourseCard({ corso }) {
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>{corso.titolo}</Card.Title>
        <Card.Text>{corso.descrizione}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">
          {corso.stato === 'attivo' ? 'In corso' : 'Completato'}
        </small>
      </Card.Footer>
    </Card>
  );
}

export default function MyCourses() {
  return (
    <Container className="py-4">
      <h2>I miei corsi</h2>
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
