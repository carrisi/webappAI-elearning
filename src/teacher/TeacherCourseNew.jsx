// src/teacher/pages/TeacherCourseNew.jsx
import React from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function TeacherCourseNew() {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    alert('Salvataggio mock — integrazione backend in step successivo');
    navigate('/docente/corsi');
  };

  return (
    <Container className="py-4">
      <h2 className="text-white mb-3">Crea nuovo corso</h2>
      <Card className="glass-surface">
        <Card.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-white">Titolo</Form.Label>
              <Form.Control placeholder="Es. Programmazione 1" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-white">Codice</Form.Label>
              <Form.Control placeholder="Es. INFO101" required />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" className="btn-glass">Salva</Button>
              <Button type="button" className="btn-glass-outline" onClick={() => navigate('/docente/corsi')}>Annulla</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
