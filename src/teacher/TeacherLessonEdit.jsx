import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Container, Form, Badge } from 'react-bootstrap';
import { listLessons, updateLesson } from '../services/courses'; // <-- path per src/teacher/
import './Style/TeacherLessonEdit.css';

export default function TeacherLessonEdit() {
  const { courseId, secId: secIdRaw, sectionId, lezId: lezIdRaw, lessonId } = useParams();
  const secId = secIdRaw || sectionId;
  const lezId = lezIdRaw || lessonId;
  const navigate = useNavigate();

  // hook SEMPRE al top-level
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // stato form - inizializzato "vuoto", poi riempito quando arriva la lezione
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [hasVideo, setHasVideo] = useState(false);
  const [hasPdf, setHasPdf] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  // carica la lezione
  useEffect(() => {
    let alive = true;
    setLoading(true);
    listLessons(courseId, secId)
      .then(rows => {
        if (!alive) return;
        const l = rows.find(x => String(x.id) === String(lezId)) || null;
        setLesson(l);
        if (l) {
          setTitle(l.title || '');
          setDescription(l.description || '');
          setDuration(l.duration || '');
          const fts = Array.isArray(l.fileTypes) ? l.fileTypes : [];
          setHasVideo(fts.includes('video'));
          setHasPdf(fts.includes('pdf'));
          setVideoUrl(l.videoUrl || '');
        }
      })
      .catch(e => { console.error('TeacherLessonEdit.listLessons', e); setLesson(null); })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [courseId, secId, lezId]);

  const currentTypes = useMemo(() => ([
    ...(hasVideo ? ['video'] : []),
    ...(hasPdf ? ['pdf'] : [])
  ]), [hasVideo, hasPdf]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLesson(courseId, secId, lezId, {
        title,
        description,
        duration,
        fileTypes: currentTypes,
        videoUrl: hasVideo ? videoUrl : '',
        type: hasVideo ? 'video' : (hasPdf ? 'reading' : null),
      });
      navigate(`/docente/corsi/${courseId}`);
    } catch (err) {
      console.error('updateLesson', err);
      alert('Impossibile aggiornare la lezione.');
    }
  };

  // ora i return condizionali possono stare QUI (dopo tutti i hook)
  if (loading) return <Container className="py-4 text-white">Caricamento…</Container>;
  if (!lesson)  return <Container className="py-4 text-white">Lezione non trovata.</Container>;

  return (
    <Container className="py-4 teacher-lesson-edit">
      <Card className="glass-surface lesson-card">
        <Card.Body className="lesson-card__body lesson-stack">
          <div className="lesson-card__inner header-inner">
            <header className="lesson-header">
              <h1 className="hero-title m-0">Modifica lezione</h1>
              <p className="hero-subtitle">Aggiorna titolo, tipologie e risorse collegate alla lezione esistente.</p>
            </header>
          </div>

          <div className="lesson-card__inner form-inner">
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Titolo</Form.Label>
                <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tipologia contenuto</Form.Label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  <Form.Check type="checkbox" id="chk-video" label="Contiene Video"
                    checked={hasVideo} onChange={(e) => setHasVideo(e.target.checked)} />
                  <Form.Check type="checkbox" id="chk-pdf" label="Contiene PDF"
                    checked={hasPdf} onChange={(e) => setHasPdf(e.target.checked)} />
                </div>
                <div className="mb-2">
                  {currentTypes.length > 0
                    ? currentTypes.map(t => <Badge key={t} bg="light" text="dark" className="me-1">{t}</Badge>)
                    : <Badge bg="light" text="dark">nessun tipo selezionato</Badge>}
                </div>
              </Form.Group>

              {hasVideo && (
                <Form.Group className="mb-3">
                  <Form.Label>Link Video</Form.Label>
                  <Form.Control type="url" placeholder="https://…" value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)} />
                </Form.Group>
              )}

              {hasPdf && (
                <Form.Group className="mb-4">
                  <Form.Label>Carica nuovo PDF</Form.Label>
                  <Form.Control type="file" accept="application/pdf" />
                  <Form.Text className="text-muted">Per ora salviamo solo i metadati.</Form.Text>
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Durata (opzionale)</Form.Label>
                <Form.Control placeholder="Es. 15 min" value={duration}
                              onChange={(e) => setDuration(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Descrizione (opzionale)</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Breve descrizione…"
                              value={description} onChange={(e) => setDescription(e.target.value)} />
              </Form.Group>

              <div className="form-actions">
                <Button type="button" className="btn-fixed btn-cancel" onClick={() => navigate(-1)}>Annulla</Button>
                <Button type="submit" className="btn-fixed btn-confirm">Salva</Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
