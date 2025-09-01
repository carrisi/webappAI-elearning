// src/teacher/pages/TeacherLessonNew.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Container, Form, Badge } from 'react-bootstrap';
import { createLesson } from '../services/courses';
import './Style/TeacherLessonNew.css';

export default function TeacherLessonNew() {
  const { courseId, secId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [kind, setKind] = useState('video');   // 'video' | 'pdf' | 'videopdf'
  const [duration, setDuration] = useState('');
  const [videoUrl, setVideoUrl] = useState(''); // <-- aggiunto: legare il campo URL

  const fileTypes =
    kind === 'videopdf' ? ['video', 'pdf']
    : kind === 'video'  ? ['video']
    :                     ['pdf'];

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Niente Storage per ora: salviamo SOLO metadati (videoUrl e/o fileTypes)
      await createLesson(courseId, secId, {
        title,
        description,
        duration,
        fileTypes,
        videoUrl: (kind === 'video' || kind === 'videopdf') ? videoUrl : '',
        type: kind === 'video' ? 'video' : (kind === 'pdf' ? 'reading' : 'video'), // opzionale
      });
      navigate(`/docente/corsi/${courseId}`);
    } catch (err) {
      console.error('createLesson:', err);
      alert('Impossibile creare la lezione.');
    }
  };

  return (
    <Container className="py-4 teacher-lesson-new">
      <Card className="glass-surface lesson-card">
        <Card.Body className="lesson-card__body lesson-stack">
          <div className="lesson-card__inner header-inner">
            <header className="lesson-header">
              <h1 className="hero-title m-0">Crea nuova lezione</h1>
              <p className="hero-subtitle">
                Imposta titolo, tipologia dei file multimediali (Video, PDF o entrambi) e carica il materiale.
              </p>
            </header>
          </div>

          <div className="lesson-card__inner form-inner">
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Titolo</Form.Label>
                <Form.Control
                  placeholder="Es. Closure e Scope"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tipologia contenuto</Form.Label>
                <div className="d-flex flex-wrap gap-2 mb-2 type-buttons">
                  <Button type="button" className={`lesson-type-btn ${kind === 'video' ? 'active' : ''}`} onClick={() => setKind('video')}>🎬 Video</Button>
                  <Button type="button" className={`lesson-type-btn ${kind === 'pdf' ? 'active' : ''}`} onClick={() => setKind('pdf')}>📄 PDF</Button>
                  <Button type="button" className={`lesson-type-btn ${kind === 'videopdf' ? 'active' : ''}`} onClick={() => setKind('videopdf')}>🎬 + 📄 Entrambi</Button>
                </div>
                <div>
                  {fileTypes.map((t) => (<Badge key={t} bg="light" text="dark" className="me-1">{t}</Badge>))}
                </div>
              </Form.Group>

              {(kind === 'video' || kind === 'videopdf') && (
                <Form.Group className="mb-3">
                  <Form.Label>Link Video</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://…"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    required={kind !== 'pdf'}
                  />
                  <Form.Text className="text-muted">
                    Inserisci il link al video (YouTube, Vimeo, ecc.).
                  </Form.Text>
                </Form.Group>
              )}

              {(kind === 'pdf' || kind === 'videopdf') && (
                <Form.Group className="mb-4">
                  <Form.Label>Carica PDF</Form.Label>
                  <Form.Control type="file" accept="application/pdf" required={kind !== 'video'} />
                  <Form.Text className="text-muted">
                    Per ora salveremo solo i metadati (niente upload su Storage).
                  </Form.Text>
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Durata (opzionale)</Form.Label>
                <Form.Control
                  placeholder="Es. 15 min"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </Form.Group>

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

              <div className="form-actions">
                <Button type="button" className="btn-fixed btn-cancel" onClick={() => navigate(-1)}>Annulla</Button>
                <Button type="submit" className="btn-fixed btn-confirm">Crea</Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>

      <div className="text-center mt-3">
        <Button type="button" className="btn-glass-outline" onClick={() => navigate(`/docente/corsi/${courseId}`)}>
          Torna al corso
        </Button>
      </div>
    </Container>
  );
}
