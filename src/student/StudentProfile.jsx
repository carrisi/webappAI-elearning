// src/pages/StudentProfile.jsx
import React, { useMemo } from 'react';
import { Container, Row, Col, Card, Badge, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Style/StudentProfile.css';
import './Style/MyCourses.css'; // riuso .glass-card e bottoni landing
import avatarFallback from '../assets/images/avatar-student.jpeg';
import myCourses from '../data/mockCourses';

// Dati utente loggato (sostituisci con auth/store)
const currentUser = {
  id: 'u-001',
  nome: 'Alessandro',
  cognome: 'Carrisi',
  username: 'a.carrisi',
  email: 'a.carrisi3@studenti.uniba.it',
  matricola: '736830',
  corsoDiStudi: 'Informatica',
  anno: 2,
  avatar: null,
  bio: `Studente di Informatica appassionato di AI applicata all'e‑learning.
Costruisco front-end reattivi, integro modelli LLM e curo UX accessibile.`,
  sede: 'Bari, IT',
};

function CourseChipList({ tags = [] }) {
  return (
    <div className="d-flex flex-wrap gap-2">
      {tags.slice(0, 6).map(t => (
        <Badge key={t} bg="light" text="dark">#{t}</Badge>
      ))}
    </div>
  );
}

function CourseMiniCard({ c }) {
  return (
    <Link to={`/studente/corsi/${c.id}`} className="text-decoration-none">
      <Card className="glass-card course-mini h-100">
        <Card.Body>
          <Card.Title className="mb-1 text-white">{c.titolo}</Card.Title>
          <div className="small text-muted mb-2">Docente: {c.instructor}</div>
          <div className="d-flex gap-2 flex-wrap mb-2">
            {Number.isFinite(c?.introduzione?.credits) && (
              <Badge bg="light" text="dark">{c.introduzione.credits} CFU</Badge>
            )}
            {c?.introduzione?.semester && (
              <Badge bg="light" text="dark">{c.introduzione.semester}</Badge>
            )}
          </div>
          <CourseChipList tags={c.tags} />
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            {c.stato === 'attivo' ? 'In corso' : 'Completato'}
          </small>
          <span className="mini-arrow">›</span>
        </Card.Footer>
      </Card>
    </Link>
  );
}

export default function StudentProfile() {
  // partizioni corsi
  const enrolled = useMemo(() => myCourses, []);
  const inCorso = useMemo(() => enrolled.filter(c => c.stato === 'attivo'), [enrolled]);
  const completati = useMemo(() => enrolled.filter(c => c.stato !== 'attivo'), [enrolled]);

  return (
    <div className="student-profile-page">
      {/* === HERO PROFILO (header in stile mock-up) === */}
      <section className="profile-hero">
        <Container>
          <Row className="gy-4 align-items-center">
            {/* Colonna sinistra: info sintetiche */}
            <Col lg={4} md={12} className="order-2 order-lg-1">
              <div className="side-block">
                <h3 className="side-title">Profilo</h3>
                <ul className="info-list">
                  <li>
                    <div className="info-ico">👤</div>
                    <div>
                      <div className="info-label">Username</div>
                      <div className="info-text">@{currentUser.username}</div>
                    </div>
                  </li>
                  <li>
                    <div className="info-ico">✉️</div>
                    <div>
                      <div className="info-label">Email</div>
                      <div className="info-text">{currentUser.email}</div>
                    </div>
                  </li>
                  <li>
                    <div className="info-ico">🎓</div>
                    <div>
                      <div className="info-label">CdL / Anno</div>
                      <div className="info-text">
                        {currentUser.corsoDiStudi} — {currentUser.anno}° anno
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="info-ico">🆔</div>
                    <div>
                      <div className="info-label">Matricola</div>
                      <div className="info-text">{currentUser.matricola}</div>
                    </div>
                  </li>
                  <li>
                    <div className="info-ico">📍</div>
                    <div>
                      <div className="info-label">Sede</div>
                      <div className="info-text">{currentUser.sede}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </Col>

            {/* Foto centrale */}
            <Col lg={4} md={6} className="order-1 order-lg-2">
              <div className="portrait-card">
                <div className="portrait-inner">
                  <img
                    src={currentUser.avatar || avatarFallback}
                    alt={`${currentUser.nome} ${currentUser.cognome}`}
                    className="portrait-img"
                  />
                </div>
              </div>
            </Col>

            {/* Dettagli e CTA a destra */}
            <Col lg={4} md={6} className="order-3">
              <div className="details-block">
                <h1 className="profile-name">
                  {currentUser.nome} <span className="surname">{currentUser.cognome}</span>
                </h1>
                <h4 className="role-muted">Studente — {currentUser.corsoDiStudi}</h4>
                <p className="bio">{currentUser.bio}</p>

                <div className="cta-row">
                  <Link to="/studente/corsi" className="landing-btn primary">
                    Vai ai miei corsi
                  </Link>
                  <Link to="/studente/impostazioni" className="landing-btn outline">
                    Modifica profilo
                  </Link>
                </div>

                <div className="stats-row">
                  <div className="stat">
                    <div className="stat-num">{enrolled.length}</div>
                    <div className="stat-label">Iscrizioni</div>
                  </div>
                  <div className="stat">
                    <div className="stat-num">{inCorso.length}</div>
                    <div className="stat-label">In corso</div>
                  </div>
                  <div className="stat">
                    <div className="stat-num">{completati.length}</div>
                    <div className="stat-label">Completati</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* === TABS CORSI (stile CourseDetail .glass-nav) === */}
      <section className="profile-courses">
        <Container>
          <div className="glass-nav">
            <Tabs defaultActiveKey="inCorso" id="student-profile-tabs" className="profile-tabs">
              <Tab eventKey="inCorso" title={`In corso (${inCorso.length})`}>
                <Row className="g-3 mt-3">
                  {inCorso.map(c => (
                    <Col key={c.id} md={6} lg={4}><CourseMiniCard c={c} /></Col>
                  ))}
                  {inCorso.length === 0 && (
                    <Col><p className="empty-msg">Nessun corso in corso.</p></Col>
                  )}
                </Row>
              </Tab>

              <Tab eventKey="completati" title={`Completati (${completati.length})`}>
                <Row className="g-3 mt-3">
                  {completati.map(c => (
                    <Col key={c.id} md={6} lg={4}><CourseMiniCard c={c} /></Col>
                  ))}
                  {completati.length === 0 && (
                    <Col><p className="empty-msg">Nessun corso completato.</p></Col>
                  )}
                </Row>
              </Tab>

              <Tab eventKey="iscrizioni" title={`Iscrizioni (${enrolled.length})`}>
                <Row className="g-3 mt-3">
                  {enrolled.map(c => (
                    <Col key={c.id} md={6} lg={4}><CourseMiniCard c={c} /></Col>
                  ))}
                  {enrolled.length === 0 && (
                    <Col><p className="empty-msg">Non sei iscritto a nessun corso.</p></Col>
                  )}
                </Row>
              </Tab>

              <Tab eventKey="tutti" title="Tutti">
                <Row className="g-3 mt-3">
                  {myCourses.map(c => (
                    <Col key={c.id} md={6} lg={4}><CourseMiniCard c={c} /></Col>
                  ))}
                </Row>
              </Tab>
            </Tabs>
          </div>
        </Container>
      </section>
    </div>
  );
}
