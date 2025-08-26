// src/teacher/pages/TeacherProfile.jsx
import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './Style/TeacherProfile.css';
import './Style/TeacherCourses.css'; // per glass-card/hero e card corsi
import teacherCourses from '../data/teacherCoursesMock';

export default function TeacherProfile() {
  // Mock dati profilo (in futuro: fetch dal backend)
  const profile = {
    initials: 'AD',
    avatarUrl: null,
    name: 'Nome',
    surname: 'Cognome',
    role: 'Docente',
    department: 'Dipartimento di Informatica',
    email: 'docente@example.com',
    phone: '+39 …',
    website: 'https://example.com',
    linkedin: 'https://linkedin.com/in/username',
    github: 'https://github.com/username',
    bio: 'Breve biografia del docente…',
    stats: { courses: teacherCourses.length, students: 128, lastActive: 'Oggi' },
  };

  const taughtCourses = teacherCourses;

  return (
    <Container className="teacher-profile-view py-4">
      {/* HERO */}
      <section className="glass-hero text-white mb-4 profile-hero">
        <Row className="g-3 align-items-center">
          <Col xs={12} md="auto">
            <div className="avatar-ring xl">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={`${profile.name} ${profile.surname}`} />
              ) : (
                <div className="avatar-placeholder">{profile.initials}</div>
              )}
            </div>
          </Col>
          <Col>
            <h1 className="hero-title mb-1">
              {profile.name} {profile.surname}
            </h1>
            <p className="hero-subtitle mb-2">
              {profile.role} • {profile.department}
            </p>
            <div className="badge-teacher d-flex gap-2 flex-wrap">
              <Badge bg="light" text="dark">{profile.role}</Badge>
              <Badge bg="light" text="dark">Anno Accademico 2024/25</Badge>
            </div>
          </Col>
          <Col xs={12} md="auto" className="mt-2 mt-md-0">
            <Link to="/docente/profilo/modifica" className="landing-btn primary">
              Modifica profilo
            </Link>
          </Col>
        </Row>
      </section>

      {/* 1) BIOGRAFIA */}
      <Row className="g-3">
        <Col xs={12}>
          <Card className="h-100 glass-card">
            <Card.Body>
              <h5 className="mb-3">Biografia</h5>
              <p className="mb-0 text-white-90">{profile.bio}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 2) CONTATTI + SOCIAL */}
      <Row className="g-3">
        <Col xs={12} md={6}>
          <Card className="h-100 glass-card">
            <Card.Body>
              <h5 className="mb-3">Contatti</h5>
              <ul className="profile-list">
                <li><span>Email</span><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
                <li><span>Telefono</span><a href={`tel:${profile.phone}`}>{profile.phone}</a></li>
                <li><span>Sito</span><a href={profile.website} target="_blank" rel="noreferrer">{profile.website}</a></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card className="h-100 glass-card">
            <Card.Body>
              <h5 className="mb-3">Social</h5>
              <ul className="profile-list">
                <li><span>LinkedIn</span><a href={profile.linkedin} target="_blank" rel="noreferrer">{profile.linkedin}</a></li>
                <li><span>GitHub</span><a href={profile.github} target="_blank" rel="noreferrer">{profile.github}</a></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 3) METRICHE */}
      <Row className="g-3">
        <Col xs={12}>
          <Card className="h-100 glass-card">
            <Card.Body>
              <h5 className="mb-3">Metriche</h5>
              <div className="kpi-grid">
                <div className="kpi">
                  <div className="kpi-value">{profile.stats.courses}</div>
                  <div className="kpi-label">Corsi attivi</div>
                </div>
                <div className="kpi">
                  <div className="kpi-value">{profile.stats.students}</div>
                  <div className="kpi-label">Studenti</div>
                </div>
                <div className="kpi">
                  <div className="kpi-value">{profile.stats.lastActive}</div>
                  <div className="kpi-label">Ultima attività</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 4) CORSI */}
      <Row className="g-3">
        <Col xs={12}>
          <Card className="h-100 glass-card">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="mb-0">Corsi</h5>
                <Link to="/docente/corsi" className="landing-btn outline">
                  Vai a tutti i corsi
                </Link>
              </div>

              <Row className="g-3">
                {taughtCourses.map(corso => (
                  <Col key={corso.id} xs={12} lg={6}>
                    <Card className="h-100 glass-card clickable-card">
                      <Card.Body>
                        <Card.Title className="courseTitle mb-1" id="title">
                          {corso.titolo}
                        </Card.Title>
                        {corso.descrizione && (
                          <Card.Text className="mb-3">{corso.descrizione}</Card.Text>
                        )}
                        <div className="course-meta mb-2 d-flex gap-2 flex-wrap">
                          {Number.isFinite(corso?.introduzione?.credits) && (
                            <Badge bg="light" text="dark">{corso.introduzione.credits} CFU</Badge>
                          )}
                          {corso?.introduzione?.semester && (
                            <Badge bg="light" text="dark">{corso.introduzione.semester}</Badge>
                          )}
                        </div>
                      </Card.Body>
                      <Card.Footer className="d-flex align-items-center justify-content-between gap-2">
                        <small className="text-muted">
                          {corso.stato.charAt(0).toUpperCase() + corso.stato.slice(1)}
                        </small>
                        <div className="d-flex gap-2 ms-auto">
                          <Link to={`/docente/corsi/${corso.id}/dashboard`} className="landing-btn primary">
                            Apri dashboard
                          </Link>
                          <Link to={`/docente/corsi/${corso.id}`} className="landing-btn outline">
                            Dettagli corso
                          </Link>
                        </div>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
