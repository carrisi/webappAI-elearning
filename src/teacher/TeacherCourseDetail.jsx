// src/teacher/pages/TeacherCourseDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, Tab, Accordion, ListGroup, Button, Modal } from 'react-bootstrap'; // <-- rimosso Form
import teacherCourses from '../data/teacherCoursesMock';
import './Style/TeacherCourseDetail.css';

export default function TeacherCourseDetail() {
  const { courseId } = useParams();
  const corso = teacherCourses.find(c => c.id === +courseId);

  // ---- Modali: elimina sezione / lezione (rimangono)
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [showDeleteLesson, setShowDeleteLesson] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // ---- (RIMOSSO) Stato e modal per "modifica info corso"
  // const [showEditInfo, setShowEditInfo] = useState(false);
  // ...tutti i campi di header e handleSaveInfo sono stati eliminati

  const handleOpenSectionModal = (secId) => {
    setSelectedSection(secId);
    setShowDeleteSection(true);
  };

  const handleOpenLessonModal = (secId, lezId) => {
    setSelectedSection(secId);
    setSelectedLesson(lezId);
    setShowDeleteLesson(true);
  };

  const handleConfirmDeleteSection = () => {
    alert(`Sezione ${selectedSection} eliminata (mock).`);
    setShowDeleteSection(false);
    setSelectedSection(null);
  };

  const handleConfirmDeleteLesson = () => {
    alert(`Lezione ${selectedLesson} eliminata dalla sezione ${selectedSection} (mock).`);
    setShowDeleteLesson(false);
    setSelectedSection(null);
    setSelectedLesson(null);
  };

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

                  {/* Modifica info corso -> ora apre pagina dedicata */}
                  <div className="text-center mt-3">
                    <Button
                      as={Link}
                      to={`/docente/corsi/${courseId}/modifica`}
                      className="btn-glass"
                    >
                      ✏️ Modifica info corso
                    </Button>
                  </div>
                </div>

                {/* Sezioni + lezioni */}
                <Accordion
                  alwaysOpen
                  defaultActiveKey={corso.sections.map(s => s.id.toString())}
                  className="cd-accordion"
                >
                  {corso.sections.map(sec => (
                    <Accordion.Item eventKey={sec.id.toString()} key={sec.id}>
                      <Accordion.Header>
                        <span className="cd-section-title">{sec.title}</span>
                        <div className="cd-section-actions" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            className="btn btn-sm btn-glass"
                            id="eliminaSezione"
                            onClick={() => handleOpenSectionModal(sec.id)}
                          >
                            Elimina sezione
                          </Button>
                        </div>
                      </Accordion.Header>

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
                                <Link
                                  className="btn btn-sm btn-glass"
                                  to={`/docente/corsi/${courseId}/sezioni/${sec.id}/lezioni/${lez.id}`}
                                >
                                  Anteprima
                                </Link>

                                <Link
                                  className="btn btn-sm btn-glass"
                                  to={`/docente/corsi/${courseId}/sezioni/${sec.id}/lezioni/${lez.id}/modifica`}
                                >
                                  Modifica
                                </Link>

                                <Button
                                  size="sm"
                                  className="btn btn-sm btn-glass btn-delete"
                                  onClick={() => handleOpenLessonModal(sec.id, lez.id)}
                                >
                                  🗑️
                                </Button>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>

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

                <div className="text-center mt-4">
                  <Button as={Link} to={`/docente/corsi/${courseId}/sezioni/nuova`} className="btn-glass">
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

      {/* Modal elimina sezione (resta) */}
      <Modal show={showDeleteSection} onHide={() => setShowDeleteSection(false)} centered>
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title>Conferma eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body className="glass-modal-body">
          Sei sicuro di voler eliminare questa sezione? Verranno eliminate anche le lezioni contenute.
        </Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-outline" onClick={() => setShowDeleteSection(false)}>
            Annulla
          </Button>
          <Button className="btn-glass" onClick={handleConfirmDeleteSection}>
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal elimina lezione (resta) */}
      <Modal show={showDeleteLesson} onHide={() => setShowDeleteLesson(false)} centered>
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title>Conferma eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body className="glass-modal-body">
          Sei sicuro di voler eliminare questa lezione?
        </Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-outline" onClick={() => setShowDeleteLesson(false)}>
            Annulla
          </Button>
          <Button className="btn-glass" onClick={handleConfirmDeleteLesson}>
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>

      {/* (RIMOSSO) Modal modifica info corso */}
    </div>
  );
}
