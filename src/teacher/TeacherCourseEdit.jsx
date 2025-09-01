import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { getCourseById, updateCourseHeader } from '../services/courses';
import './Style/TeacherCourseEdit.css';

export default function TeacherCourseEdit() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);
    getCourseById(courseId)
      .then(c => { if (alive) setCourse(c || null); })
      .catch(e => {
        console.error('getCourseById:', e);
      if (alive) { setErr('Impossibile caricare il corso.'); setCourse(null); }
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [courseId]);

  // Stati del form (restano identici)
  const [title, setTitle] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [prof, setProf] = useState('');
  const [degree, setDegree] = useState('');
  const [semester, setSemester] = useState('');
  const [credits, setCredits] = useState('');
  const [notes, setNotes] = useState('');
  const [officeHoursTitle, setOfficeHoursTitle] = useState('');
  const [officeHours, setOfficeHours] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (!course) return;
    setTitle(course.titolo || '');
    setAcademicYear(course.introduzione?.academicYear || '');
    setProf(course.introduzione?.professor || '');
    setDegree(course.introduzione?.degree || '');
    setSemester(course.introduzione?.semester || '');
    setCredits(course.introduzione?.credits || '');
    setNotes(course.introduzione?.notes || '');
    setOfficeHoursTitle(course.introduzione?.officeHoursTitle || '');
    setOfficeHours(course.introduzione?.officeHours || '');
    setDesc(course.descrizione || '');
  }, [course]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCourseHeader(courseId, {
        titolo: title,
        descrizione: desc,
        introd: {
          academicYear, professor: prof, degree, semester,
          credits: credits ? Number(credits) : null,
          notes, officeHoursTitle, officeHours,
        }
      });
      navigate(`/docente/corsi/${courseId}`);
    } catch (err) {
      console.error('updateCourseHeader:', err);
      alert('Impossibile salvare le modifiche.');
    }
  };

  // ---- schermate di stato (evitano "pagina bianca") ----
  if (loading)   return <Container className="py-4 text-white">Caricamento…</Container>;
  if (err)       return <Container className="py-4 text-white">{err}</Container>;
  if (!course)   return <Container className="py-4 text-white">Corso non trovato.</Container>;

  return (
    <Container className="py-4 teacher-lesson-edit">
      <Card className="glass-surface lesson-card">
        <Card.Body className="lesson-card__body lesson-stack">
          <div className="lesson-card__inner header-inner">
            <header className="lesson-header">
              <h1 className="hero-title m-0">Modifica info corso</h1>
              <p className="hero-subtitle">Aggiorna tutte le informazioni generali mostrate nell’header del corso.</p>
            </header>
          </div>
          <div className="lesson-card__inner form-inner">
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Titolo corso</Form.Label>
                <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required />
              </Form.Group>

              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Anno accademico</Form.Label>
                    <Form.Control value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Docente</Form.Label>
                    <Form.Control value={prof} onChange={(e) => setProf(e.target.value)} />
                  </Form.Group>
                </div>
              </div>

              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Corso di laurea (CdL)</Form.Label>
                    <Form.Control value={degree} onChange={(e) => setDegree(e.target.value)} />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Semestre</Form.Label>
                    <Form.Control value={semester} onChange={(e) => setSemester(e.target.value)} />
                  </Form.Group>
                </div>
              </div>

              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>CFU</Form.Label>
                    <Form.Control type="number" min="0" step="1" value={credits} onChange={(e) => setCredits(e.target.value)} />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Note</Form.Label>
                    <Form.Control value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </Form.Group>
                </div>
              </div>

              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Titolo ricevimento</Form.Label>
                    <Form.Control value={officeHoursTitle} onChange={(e) => setOfficeHoursTitle(e.target.value)} />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Ricevimento studenti (orari/note)</Form.Label>
                    <Form.Control value={officeHours} onChange={(e) => setOfficeHours(e.target.value)} />
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-0 mt-3">
                <Form.Label>Descrizione / Obiettivi</Form.Label>
                <Form.Control as="textarea" rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} />
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
