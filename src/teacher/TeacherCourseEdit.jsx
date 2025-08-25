import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Container, Form } from 'react-bootstrap';
import teacherCourses from '../data/teacherCoursesMock';
// usiamo lo STESSO stile/structure di LessonEdit (classi identiche)
import './Style/TeacherCourseEdit.css';

export default function TeacherCourseEdit() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = useMemo(
    () => teacherCourses.find(c => String(c.id) === String(courseId)) || null,
    [courseId]
  );

  if (!course) {
    return <Container className="py-4 text-white">Corso non trovato.</Container>;
  }

  // campi header corso (copiati dal vecchio modal di CourseDetail)
  const [title, setTitle] = useState(course.titolo || '');
  const [academicYear, setAcademicYear] = useState(course.introduzione?.academicYear || '');
  const [prof, setProf] = useState(course.introduzione?.professor || '');
  const [degree, setDegree] = useState(course.introduzione?.degree || '');
  const [semester, setSemester] = useState(course.introduzione?.semester || '');
  const [credits, setCredits] = useState(course.introduzione?.credits || '');
  const [notes, setNotes] = useState(course.introduzione?.notes || '');
  const [officeHoursTitle, setOfficeHoursTitle] = useState(course.introduzione?.officeHoursTitle || '');
  const [officeHours, setOfficeHours] = useState(course.introduzione?.officeHours || '');
  const [desc, setDesc] = useState(course.descrizione || '');

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: salva su backend
    alert(
      `Info corso aggiornate (mock):\n` +
      `Titolo: ${title}\n` +
      `Anno acc.: ${academicYear}\n` +
      `Docente: ${prof}\n` +
      `CdL: ${degree} | Semestre: ${semester} | CFU: ${credits}\n` +
      `Note: ${notes}\n${officeHoursTitle}: ${officeHours}\n` +
      `Descrizione: ${desc.substring(0,120)}…`
    );
    navigate(`/docente/corsi/${courseId}`);
  };

  return (
    // NB: usiamo le STESSE classi di LessonEdit per garantire lo stesso look
    <Container className="py-4 teacher-lesson-edit">
      <Card className="glass-surface lesson-card">
        <Card.Body className="lesson-card__body lesson-stack">
          {/* Header trasparente (hero) */}
          <div className="lesson-card__inner header-inner">
            <header className="lesson-header">
              <h1 className="hero-title m-0">Modifica info corso</h1>
              <p className="hero-subtitle">
                Aggiorna tutte le informazioni generali mostrate nell’header del corso.
              </p>
            </header>
          </div>

          {/* Form bianco */}
          <div className="lesson-card__inner form-inner">
            <Form onSubmit={onSubmit}>
              {/* Titolo corso */}
              <Form.Group className="mb-3">
                <Form.Label>Titolo corso</Form.Label>
                <Form.Control
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Riga 2 */}
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Anno accademico</Form.Label>
                    <Form.Control
                      placeholder="Es. 2024/2025"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Docente</Form.Label>
                    <Form.Control
                      placeholder="Es. Prof. Rossi"
                      value={prof}
                      onChange={(e) => setProf(e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>

              {/* Riga 3 */}
              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Corso di laurea (CdL)</Form.Label>
                    <Form.Control
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Semestre</Form.Label>
                    <Form.Control
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>

              {/* Riga 4 */}
              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>CFU</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      step="1"
                      value={credits}
                      onChange={(e) => setCredits(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Note</Form.Label>
                    <Form.Control
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>

              {/* Riga 5 */}
              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Titolo ricevimento</Form.Label>
                    <Form.Control
                      value={officeHoursTitle}
                      onChange={(e) => setOfficeHoursTitle(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Ricevimento studenti (orari/note)</Form.Label>
                    <Form.Control
                      value={officeHours}
                      onChange={(e) => setOfficeHours(e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>

              {/* Descrizione / Obiettivi */}
              <Form.Group className="mb-0 mt-3">
                <Form.Label>Descrizione / Obiettivi</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </Form.Group>

              {/* CTA */}
              <div className="form-actions">
                <Button
                  type="button"
                  className="btn-fixed btn-cancel"
                  onClick={() => navigate(-1)}
                >
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
