import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Tabs, Tab, Accordion, ListGroup, Button, Modal, Container } from 'react-bootstrap';
import './Style/TeacherCourseDetail.css';

import {
  getCourseById,
  listSections,
  listLessons,
  deleteSectionDeep,
  deleteLesson,
  deleteCourseDeep
} from '../services/courses';

export default function TeacherCourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [corso, setCorso] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [showDeleteLesson, setShowDeleteLesson] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [showDeleteCourse, setShowDeleteCourse] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(false);

  // NEW STATE per mostra altro/meno
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const c = await getCourseById(courseId);
        if (!alive) return;
        setCorso(c || null);
        if (!c) return;

        const secs = await listSections(courseId);
        if (!alive) return;

        const withLessons = [];
        for (const s of secs) {
          const lez = await listLessons(courseId, s.id);
          withLessons.push({ ...s, lessons: lez });
        }
        setSections(withLessons);
      } catch (e) {
        console.error('TeacherCourseDetail load:', e);
        setCorso(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [courseId]);

  const handleOpenSectionModal = (secId) => {
    setSelectedSection(secId);
    setShowDeleteSection(true);
  };
  const handleOpenLessonModal = (secId, lezId) => {
    setSelectedSection(secId);
    setSelectedLesson(lezId);
    setShowDeleteLesson(true);
  };

  const handleConfirmDeleteSection = async () => {
    try {
      await deleteSectionDeep(courseId, selectedSection);
      setSections(prev => prev.filter(s => s.id !== selectedSection));
    } catch (e) {
      console.error('deleteSectionDeep:', e);
      alert('Errore durante l’eliminazione della sezione.');
    } finally {
      setShowDeleteSection(false);
      setSelectedSection(null);
    }
  };

  const handleConfirmDeleteLesson = async () => {
    try {
      await deleteLesson(courseId, selectedSection, selectedLesson);
      setSections(prev =>
        prev.map(s =>
          s.id === selectedSection
            ? { ...s, lessons: (s.lessons || []).filter(l => l.id !== selectedLesson) }
            : s
        )
      );
    } catch (e) {
      console.error('deleteLesson:', e);
      alert('Errore durante l’eliminazione della lezione.');
    } finally {
      setShowDeleteLesson(false);
      setSelectedSection(null);
      setSelectedLesson(null);
    }
  };

  // handler elimina corso
  const handleConfirmDeleteCourse = async () => {
    try {
      setDeletingCourse(true);
      await deleteCourseDeep(courseId);
      navigate('/docente/corsi', { replace: true });
    } catch (e) {
      console.error('deleteCourseDeep:', e);
      alert('Errore durante l’eliminazione del corso.');
    } finally {
      setDeletingCourse(false);
      setShowDeleteCourse(false);
    }
  };

  if (loading) return <Container className="py-4 text-white">Caricamento…</Container>;
  if (!corso)  return <Container className="py-4 text-white">Corso non trovato.</Container>;

  return (
    <div className="course-detail-page">
      <h2 className="cd-title">{corso.titolo}</h2>

      <div className="glass-nav-container glass-nav">
        <Tabs defaultActiveKey="corso" id="teacher-course-detail-tabs" className="cd-tabs">
          <Tab eventKey="corso" title="Corso">
            <div className="glass-intro-container mb-4">
              <div className="intro-year">{corso.introduzione?.academicYear}</div>
              <h5 className="intro-professor">{corso.introduzione?.professor}</h5>
              <div className="intro-degree">
                {corso.introduzione?.degree} – {corso.introduzione?.semester}
                {Number.isFinite(corso.introduzione?.credits) ? `, ${corso.introduzione.credits} CFU` : ''}
              </div>
              <hr />
              <div className="intro-notes">{corso.introduzione?.notes}</div>
              <h6 className="intro-office-title">{corso.introduzione?.officeHoursTitle}</h6>
              <div className="intro-office">{corso.introduzione?.officeHours}</div>
              <hr />
              <h5>Obiettivi del corso</h5>
              
              <p className={`course-description ${expanded ? 'expanded' : 'collapsed'}`}>
                {corso.descrizione}
              </p>
              {corso.descrizione && corso.descrizione.length > 0 && (
                <Button
                  variant="link"
                  className="toggle-description"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? 'Mostra meno' : 'Mostra altro'}
                </Button>
              )}

              <div className="text-center mt-3">
                <Button as={Link} to={`/docente/corsi/${courseId}/modifica`} className="btn-glass">
                  ✏️ Modifica info corso
                </Button>
              </div>
            </div>

            {/* sezioni e lezioni */}
            {sections.length === 0 ? (
              <p className="text-white-50">Nessuna sezione presente. Aggiungine una qui sotto.</p>
            ) : (
              <Accordion alwaysOpen defaultActiveKey={sections.map(s => s.id)} className="cd-accordion">
                {sections.map(sec => (
                  <Accordion.Item eventKey={sec.id} key={sec.id}>
                    {/* HEADER: solo titolo, niente bottoni */}
                    <Accordion.Header>
                      <span className="cd-section-title">{sec.title}</span>
                    </Accordion.Header>

                    {/* BODY: toolbar azioni + elenco lezioni */}
                    <Accordion.Body>
                      {/* Toolbar azioni sezione */}
                      <div className="d-flex justify-content-end mb-2">
                        <Button
                          size="sm"
                          className="btn btn-sm btn-glass btn-delete"
                          onClick={() => handleOpenSectionModal(sec.id)}
                        >
                          Elimina sezione
                        </Button>
                      </div>

                      <ListGroup variant="flush">
                        {(sec.lessons || []).map(lez => (
                          <ListGroup.Item
                            key={lez.id}
                            className="glass-card clickable-card mb-2 d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <span>{lez.title}</span>{" "}
                              <small className="text-muted ms-3">[{(lez.fileTypes || []).join(", ")}]</small>
                            </div>
                        
                            <div className="d-flex gap-2">
                              <Link className="btn btn-sm btn-glass"
                                   to={`/docente/corsi/${courseId}/sezioni/${sec.id}/lezioni/${lez.id}`}>Anteprima</Link>
                              <Link className="btn btn-sm btn-glass"
                                   to={`/docente/corsi/${courseId}/sezioni/${sec.id}/lezioni/${lez.id}/modifica`}>Modifica</Link>
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
            )}

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

      {/* BOTTONI IN BASSO */}
      <div className="text-center mt-3 d-flex justify-content-center gap-2 flex-wrap">
        <Link to="/docente/corsi" className="landing-btn outline">Torna ai corsi</Link>
        <Button
          variant="danger"
          className="landing-btn primary"
          onClick={() => setShowDeleteCourse(true)}
        >
          🗑️ Elimina corso
        </Button>
      </div>

      {/* Modali elimina */}
      <Modal show={showDeleteSection} onHide={() => setShowDeleteSection(false)} centered>
        <Modal.Header closeButton className="glass-modal-header"><Modal.Title>Conferma eliminazione</Modal.Title></Modal.Header>
        <Modal.Body className="glass-modal-body">Sei sicuro di voler eliminare questa sezione? Verranno eliminate anche le lezioni contenute.</Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-outline" onClick={() => setShowDeleteSection(false)}>Annulla</Button>
          <Button className="btn-glass" onClick={handleConfirmDeleteSection}>Elimina</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteLesson} onHide={() => setShowDeleteLesson(false)} centered>
        <Modal.Header closeButton className="glass-modal-header"><Modal.Title>Conferma eliminazione</Modal.Title></Modal.Header>
        <Modal.Body className="glass-modal-body">Sei sicuro di voler eliminare questa lezione?</Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-outline" onClick={() => setShowDeleteLesson(false)}>Annulla</Button>
          <Button className="btn-glass" onClick={handleConfirmDeleteLesson}>Elimina</Button>
        </Modal.Footer>
      </Modal>

      {/* Modale elimina corso */}
      <Modal show={showDeleteCourse} onHide={() => setShowDeleteCourse(false)} centered>
        <Modal.Header closeButton className="glass-modal-header"><Modal.Title>Elimina corso</Modal.Title></Modal.Header>
        <Modal.Body className="glass-modal-body">
          Questa azione eliminerà definitivamente il corso e <b>tutti</b> i contenuti correlati.
        </Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-outline" onClick={() => setShowDeleteCourse(false)} disabled={deletingCourse}>
            Annulla
          </Button>
          <Button className="btn-glass outline" onClick={handleConfirmDeleteCourse} disabled={deletingCourse}>
            {deletingCourse ? 'Elimino…' : 'Elimina definitivamente'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
