// src/teacher/pages/TeacherCourseDetail.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, Tab, Accordion, ListGroup, Button } from 'react-bootstrap';

// NOTE: pages/ -> risali di una cartella per Style e di due per data
import teacherCourses from '../data/teacherCoursesMock';
import './Style/TeacherCourseDetail.css';

export default function TeacherCourseDetail() {
  const { courseId } = useParams();
  const corso = teacherCourses.find(c => c.id === +courseId);

  return (
    <div className="course-detail-page">
      {!corso ? (
        <div className="cd-not-found">
          <h3>Corso non trovato</h3>
        </div>
      ) : (
        <>
          <h2 className="cd-title">{corso.titolo}</h2>

          <div className="glass-nav-container glass-nav">
            <Tabs defaultActiveKey="corso" id="teacher-course-detail-tabs" className="cd-tabs">
              <Tab eventKey="corso" title="Corso">
                <div className="glass-intro-container mb-4">
                  <div className="intro-year">{corso.introduzione.academicYear}</div>
                  <h5 className="intro-professor">{corso.introduzione.professor}</h5>
                  <div className="intro-degree">
                    {corso.introduzione.degree} – {corso.introduzione.semester}, {corso.introduzione.credits} CFU
                  </div>
                  <hr />
                  <div className="intro-notes">{corso.introduzione.notes}</div>
                  <h6 className="intro-office-title">{corso.introduzione.officeHoursTitle}</h6>
                  <div className="intro-office">{corso.introduzione.officeHours}</div>
                  <hr />
                  <h5>Obiettivi del corso</h5>
                  <p>{corso.descrizione}</p>
                </div>

                <Accordion
                  alwaysOpen
                  defaultActiveKey={corso.sections.map(s => s.id.toString())}
                  className="cd-accordion"
                >
                  {corso.sections.map(sec => (
                    <Accordion.Item eventKey={sec.id.toString()} key={sec.id}>
                      <Accordion.Header>{sec.title}</Accordion.Header>
                      <Accordion.Body>
                        <ListGroup variant="flush">
                          {sec.lessons.map(lez => (
                            <ListGroup.Item
                              key={lez.id}
                              className="glass-card clickable-card mb-2 d-flex justify-content-between align-items-center"
                            >
                              <div>
                                <span>{lez.title}</span>{' '}
                                <small className="text-muted ms-3">[{(lez.fileTypes || []).join(', ')}]</small>
                              </div>

                              <div className="d-flex gap-2">
                                {/* Anteprima lezione (video/pdf/entrambi) */}
                                <Link
                                  className="btn btn-sm btn-glass"
                                  to={`/docente/corsi/${courseId}/sezioni/${sec.id}/lezioni/${lez.id}`}
                                >
                                  Anteprima
                                </Link>

                                {/* Modifica lezione */}
                                <Link
                                  className="btn btn-sm btn-glass"
                                  to={`/docente/corsi/${courseId}/sezioni/${sec.id}/lezioni/${lez.id}/modifica`}
                                >
                                  Modifica
                                </Link>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>

                        {/* Aggiungi nuova lezione alla sezione */}
                        <Button
                          as={Link}
                          to={`/docente/corsi/${courseId}/sezioni/${sec.id}/lezioni/nuova`}
                          className="btn-glass mt-2"
                        >
                          + Aggiungi lezione
                        </Button>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>

                {/* Pulsante per aggiungere una nuova sezione */}
                <div className="text-center mt-4">
                  <Button
                    as={Link}
                    to={`/docente/corsi/${courseId}/sezioni/nuova`}
                    className="btn-glass"
                  >
                    + Aggiungi sezione
                  </Button>
                </div>
              </Tab>

              <Tab eventKey="valutazioni" title="Valutazioni">
                <p>Gestisci valutazioni, compiti ed esoneri (placeholder).</p>
              </Tab>

              <Tab eventKey="materiali" title="Materiali">
                <p>Carica e organizza i materiali del corso (placeholder).</p>
              </Tab>
            </Tabs>
          </div>

          <div className="text-center mt-3">
            <Link to="/docente/corsi" className="landing-btn outline">Torna ai corsi</Link>
          </div>
        </>
      )}
    </div>
  );
}
