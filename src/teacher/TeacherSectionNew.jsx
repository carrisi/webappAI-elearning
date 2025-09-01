// src/teacher/pages/TeacherSectionNew.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { createSection } from '../services/courses';
import './Style/TeacherSectionNew.css';

export default function TeacherSectionNew() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSection(courseId, { title, description, order: 1 });
      navigate(`/docente/corsi/${courseId}`);
    } catch (err) {
      console.error('createSection:', err);
      alert('Impossibile creare la sezione.');
    }
  };

  return (
    <Container className="py-4 teacher-section-new">
      <Card className="glass-surface lesson-card">
        <Card.Body className="lesson-card__body lesson-stack">
          <div className="lesson-card__inner header-inner">
            <header className="lesson-header">
              <h1 className="hero-title m-0">Crea nuova sezione</h1>
              <p className="hero-subtitle">Definisci titolo e descrizione per organizzare meglio le lezioni del corso.</p>
            </header>
          </div>

          <div className="lesson-card__inner form-inner">
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Titolo sezione</Form.Label>
                <Form.Control
                  placeholder="Es. Introduzione a JavaScript"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Descrizione</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Breve descrizione della sezione..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <div className="form-actions">
                <Button type="button" className="btn-fixed btn-cancel" onClick={() => navigate(-1)}>Annulla</Button>
                <Button type="submit" className="btn-fixed btn-confirm">Crea</Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
