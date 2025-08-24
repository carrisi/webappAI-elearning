// src/teacher/pages/TeacherLessonNew.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Container, Form, Badge } from 'react-bootstrap';
import './Style/TeacherLessonNew.css';

export default function TeacherLessonNew() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [kind, setKind] = useState('video');
  const [duration, setDuration] = useState('');

  const fileTypes =
    kind === 'videopdf' ? ['video', 'pdf'] :
    kind === 'video'    ? ['video'] :
    ['pdf'];

  const onSubmit = (e) => {
    e.preventDefault();
    alert(
      `Lezione creata (mock):\n` +
      `Titolo: ${title}\n` +
      `Tipo: ${fileTypes.join(' + ')}\n` +
      (duration ? `Durata: ${duration}\n` : '') +
      (description ? `Descrizione: ${description}\n` : '')
    );
    navigate(`/docente/corsi/${courseId}`);
  };

  return (
    <Container className="py-4 teacher-lesson-new">
      {/* Glass unico, due inner: header + form */}
      <Card className="glass-surface lesson-card">
        <Card.Body className="lesson-card__body lesson-stack">
          {/* Header trasparente */}
          <div className="lesson-card__inner header-inner">
            <header className="lesson-header">
              <h1 className="hero-title m-0">Crea nuova lezione</h1>
              <p className="hero-subtitle">
                Imposta titolo, tipologia dei file multimediali (Video, PDF o entrambi) e carica il materiale.
              </p>
            </header>
          </div>

          {/* Form con sfondo bianco */}
          <div className="lesson-card__inner form-inner">
            <Form onSubmit={onSubmit}>
              {/* Titolo */}
              <Form.Group className="mb-3">
                <Form.Label>Titolo</Form.Label>
                <Form.Control
                  placeholder="Es. Closure e Scope"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Tipologia */}
              <Form.Group className="mb-3">
                <Form.Label>Tipologia contenuto</Form.Label>
                <div className="d-flex flex-wrap gap-2 mb-2 type-buttons">
                  <Button
                    type="button"
                    className={`lesson-type-btn ${kind === 'video' ? 'active' : ''}`}
                    onClick={() => setKind('video')}
                  >
                    🎬 Video
                  </Button>
                  <Button
                    type="button"
                    className={`lesson-type-btn ${kind === 'pdf' ? 'active' : ''}`}
                    onClick={() => setKind('pdf')}
                  >
                    📄 PDF
                  </Button>
                  <Button
                    type="button"
                    className={`lesson-type-btn ${kind === 'videopdf' ? 'active' : ''}`}
                    onClick={() => setKind('videopdf')}
                  >
                    🎬 + 📄 Entrambi
                  </Button>
                </div>
                <div>
                  {fileTypes.map((t) => (
                    <Badge key={t} bg="light" text="dark" className="me-1">{t}</Badge>
                  ))}
                </div>
              </Form.Group>
                
              {/* Campo Video URL (se selezionato) */}
              {(kind === 'video' || kind === 'videopdf') && (
  <Form.Group className="mb-3">
    <Form.Label>Link Video</Form.Label>
    <Form.Control
      type="url"
      placeholder="https://…"
      required={kind !== 'pdf'}
    />
    <Form.Text className="text-muted">
      Inserisci il link al video (YouTube, Vimeo, ecc.).
    </Form.Text>
  </Form.Group>
              )}
              
              {/* Upload PDF (se selezionato) */}
              {(kind === 'pdf' || kind === 'videopdf') && (
  <Form.Group className="mb-4">
    <Form.Label>Carica PDF</Form.Label>
    <Form.Control type="file" accept="application/pdf" required={kind !== 'video'} />
    <Form.Text className="text-muted">
      Formato supportato: PDF.
    </Form.Text>
  </Form.Group>
              )}


              {/* Durata */}
              <Form.Group className="mb-3">
                <Form.Label>Durata (opzionale)</Form.Label>
                <Form.Control
                  placeholder="Es. 15 min"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </Form.Group>

              {/* Descrizione */}
              <Form.Group className="mb-4">
                <Form.Label>Descrizione (opzionale)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Breve descrizione della lezione…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              {/* CTA */}
              <div className="form-actions">
                <Button type="button" className="btn-fixed btn-cancel" onClick={() => navigate(-1)}>
                  Annulla
                </Button>
                <Button type="submit" className="btn-fixed btn-confirm">
                  Crea
                </Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>

      {/* Link secondario */}
      <div className="text-center mt-3">
        <Button
          type="button"
          className="btn-glass-outline"
          onClick={() => navigate(`/docente/corsi/${courseId}`)}
        >
          Torna al corso
        </Button>
      </div>
    </Container>
  );
}
