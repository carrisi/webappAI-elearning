// src/teacher/pages/TeacherLessonEdit.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Container, Form, Badge } from 'react-bootstrap';
import teacherCourses from '../data/teacherCoursesMock';
import './Style/TeacherLessonEdit.css';

export default function TeacherLessonEdit() {
  const { courseId, secId, lezId } = useParams();
  const navigate = useNavigate();

  // Trova lezione
  const courseIdx = teacherCourses.findIndex(c => String(c.id) === String(courseId));
  const secIdx    = courseIdx >= 0 ? teacherCourses[courseIdx].sections.findIndex(s => String(s.id) === String(secId)) : -1;
  const lessonIdx = secIdx >= 0 ? teacherCourses[courseIdx].sections[secIdx].lessons.findIndex(l => String(l.id) === String(lezId)) : -1;

  const lesson = useMemo(() => {
    if (courseIdx < 0 || secIdx < 0 || lessonIdx < 0) return null;
    return teacherCourses[courseIdx].sections[secIdx].lessons[lessonIdx];
  }, [courseIdx, secIdx, lessonIdx]);

  if (!lesson) {
    return <Container className="py-4 text-white">Lezione non trovata.</Container>;
  }

  // Stato iniziale
  const [title, setTitle] = useState(lesson.title || '');
  const [description, setDescription] = useState(lesson.description || '');
  const [duration, setDuration] = useState(lesson.duration || '');
  const [hasVideo, setHasVideo] = useState((lesson.fileTypes || []).includes('video'));
  const [hasPdf, setHasPdf] = useState((lesson.fileTypes || []).includes('pdf'));
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl || '');
  const [pdfUrl, setPdfUrl] = useState(lesson.pdfUrl || '');

  const currentTypes = [
    ...(hasVideo ? ['video'] : []),
    ...(hasPdf ? ['pdf'] : [])
  ];

  const onSubmit = (e) => {
    e.preventDefault();
    alert(
      `Lezione aggiornata (mock):\n` +
      `Titolo: ${title}\n` +
      `Tipi: ${currentTypes.join(' + ') || '—'}\n` +
      (hasVideo ? `Video: ${videoUrl || '—'}\n` : '') +
      (hasPdf ? `PDF: ${pdfUrl || '—'}\n` : '') +
      (duration ? `Durata: ${duration}\n` : '') +
      (description ? `Descrizione: ${description}\n` : '')
    );
    navigate(`/docente/corsi/${courseId}`);
  };

  return (
    <Container className="py-4 teacher-lesson-edit">
      <Card className="glass-surface lesson-card">
        <Card.Body className="lesson-card__body lesson-stack">
          {/* Header trasparente */}
          <div className="lesson-card__inner header-inner">
            <header className="lesson-header">
              <h1 className="hero-title m-0">Modifica lezione</h1>
              <p className="hero-subtitle">
                Aggiorna titolo, tipologie e risorse collegate alla lezione esistente.
              </p>
            </header>
          </div>

          {/* Form bianco */}
          <div className="lesson-card__inner form-inner">
            <Form onSubmit={onSubmit}>
              {/* Titolo */}
              <Form.Group className="mb-3">
                <Form.Label>Titolo</Form.Label>
                <Form.Control
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Tipologie */}
              <Form.Group className="mb-3">
                <Form.Label>Tipologia contenuto</Form.Label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  <Form.Check
                    type="checkbox"
                    id="chk-video"
                    label="Contiene Video"
                    checked={hasVideo}
                    onChange={(e) => setHasVideo(e.target.checked)}
                  />
                  <Form.Check
                    type="checkbox"
                    id="chk-pdf"
                    label="Contiene PDF"
                    checked={hasPdf}
                    onChange={(e) => setHasPdf(e.target.checked)}
                  />
                </div>
                <div className="mb-2">
                  {currentTypes.length > 0
                    ? currentTypes.map(t => <Badge key={t} bg="light" text="dark" className="me-1">{t}</Badge>)
                    : <Badge bg="light" text="dark">nessun tipo selezionato</Badge>}
                </div>
              </Form.Group>
                  
              {/* Video URL */}
              {hasVideo && (
                <Form.Group className="mb-3">
                  <Form.Label>Link Video</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://…"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </Form.Group>
              )}
              
              {/* PDF Upload */}
              {hasPdf && (
                <Form.Group className="mb-4">
                  <Form.Label>Carica nuovo PDF</Form.Label>
                  <Form.Control type="file" accept="application/pdf" />
                  <Form.Text className="text-muted">
                    Se non carichi un nuovo PDF rimane quello esistente.
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
                  Salva
                </Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
