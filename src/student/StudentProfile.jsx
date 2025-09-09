// src/pages/StudentProfile.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './Style/StudentProfile.css';
import './Style/MyCourses.css'; // per glass-card/hero e bottoni

import { db, auth } from '../firebase';
import {
  doc, getDoc, collection, query, where, getDocs,
} from 'firebase/firestore';

export default function StudentProfile() {
  const uid = auth.currentUser?.uid || null;

  const [profile, setProfile] = useState(null);     // /users/{uid}
  const [enrolled, setEnrolled] = useState([]);     // corsi iscritti (dettagli corso)
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        if (!uid) return;

        // 1) Profilo utente
        let p = null;
        try {
          const userSnap = await getDoc(doc(db, 'users', uid));
          if (userSnap.exists()) p = userSnap.data();
        } catch (e) {
          console.error('StudentProfile: load user', e);
        }

        // fallback su auth (se mancano alcuni campi)
        const displayName = p?.displayName || auth.currentUser?.displayName || '';
        const [name, surname] = displayName ? displayName.split(' ') : [p?.name || '', p?.surname || ''];
        const role = p?.role || 'student';
        const email = p?.email || auth.currentUser?.email || '';

        const hydratedProfile = {
          initials: `${(name||'').charAt(0)}${(surname||'').charAt(0)}`.toUpperCase() || 'ST',
          avatarUrl: p?.photoURL || null,
          name: name || p?.name || '',
          surname: surname || p?.surname || '',
          role: role === 'teacher' ? 'Docente' : 'Studente',
          degree: p?.degree || p?.department || '',   // per studenti usa "degree", altrimenti department
          year: p?.year || '',                        // opzionale se presente
          email,
          sede: p?.campus || p?.sede || '',
          bio: p?.bio || '',
        };
        if (alive) setProfile(hydratedProfile);

        // 2) Iscrizioni dello studente
        const qEnroll = query(collection(db, 'enrollments'), where('userId', '==', uid));
        const enrollSnap = await getDocs(qEnroll);
        const enrollments = enrollSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // 3) Dettagli corsi per ogni enrollment
        const courseIds = [...new Set(enrollments.map(e => e.courseId).filter(Boolean))];
        const courseDocs = await Promise.all(
          courseIds.map(async (courseId) => {
            try {
              const cSnap = await getDoc(doc(db, 'courses', courseId));
              if (!cSnap.exists()) return null;
              const c = cSnap.data();
              const intro = c.introduzione || {};
              return {
                id: cSnap.id,
                titolo: c.titolo || 'Corso',
                descrizione: c.descrizione || '',
                stato: c.stato || 'attivo',
                introduzione: {
                  credits: intro.credits ?? c.credits ?? undefined,
                  semester: intro.semester || c.semester || '',
                },
                instructor: intro.professor || c.professor || '',
              };
            } catch {
              return null;
            }
          })
        );

        const joined = courseDocs.filter(Boolean);
        if (alive) setEnrolled(joined);
      } catch (e) {
        console.error('StudentProfile: load error', e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [uid]);

  const inCorso = useMemo(() => enrolled.filter(c => (c.stato || '').toLowerCase() === 'attivo'), [enrolled]);
  const completati = useMemo(() => enrolled.filter(c => (c.stato || '').toLowerCase() !== 'attivo'), [enrolled]);

  // Placeholder se non ancora caricati i dati
  const user = profile || {
    initials: '--',
    avatarUrl: null,
    name: '',
    surname: '',
    role: 'Studente',
    degree: '',
    year: '',
    email: '',
    sede: '',
    bio: '',
  };

  return (
    <Container className="student-profile-view py-4">
      {/* HERO */}
      <section className="glass-hero text-white mb-4 profile-hero">
        <Row className="g-3 align-items-center">
          <Col xs={12} md="auto">
            <div className="avatar-ring xl">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={`${user.name} ${user.surname}`} />
              ) : (
                <div className="avatar-placeholder">{user.initials}</div>
              )}
            </div>
          </Col>
          <Col>
            <h1 className="hero-title mb-1">
              {user.name} {user.surname}
            </h1>
            <p className="hero-subtitle mb-2">
              {user.role}{' '}
              {user.degree ? <>• {user.degree}</> : null}
              {user.year ? <> ({user.year}° anno)</> : null}
            </p>
            <div className="badge-teacher d-flex gap-2 flex-wrap">
              <Badge bg="light" text="dark">{user.role}</Badge>
              <Badge bg="light" text="dark">Anno Accademico 2024/25</Badge>
            </div>
          </Col>
          <Col xs={12} md="auto" className="mt-2 mt-md-0">
            <Link to="/studente/impostazioni" className="landing-btn primary">
              Modifica profilo
            </Link>
          </Col>
        </Row>
      </section>

      {/* BIO */}
      <Row className="g-3">
        <Col xs={12}>
          <Card className="h-100 glass-card">
            <Card.Body>
              <h5 className="mb-3">Biografia</h5>
              <p className="mb-0 text-white-90">
                {loading && !user.bio ? 'Caricamento…' : (user.bio || '—')}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CONTATTI + INFO */}
      <Row className="g-3">
        <Col xs={12} md={6}>
          <Card className="h-100 glass-card">
            <Card.Body>
              <h5 className="mb-3">Contatti</h5>
              <ul className="profile-list">
                <li><span>Email</span>{user.email ? <a href={`mailto:${user.email}`}>{user.email}</a> : '—'}</li>
                <li><span>Matricola</span>{user.matricola || '—'}</li>
                <li><span>Sede</span>{user.sede || '—'}</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card className="h-100 glass-card">
            <Card.Body>
              <h5 className="mb-3">Social</h5>
              <ul className="profile-list">
                <li><span>Website</span>{profile?.website ? <a href={profile.website} target="_blank" rel="noreferrer">{profile.website}</a> : '—'}</li>
                <li><span>LinkedIn</span>{profile?.linkedin ? <a href={profile.linkedin} target="_blank" rel="noreferrer">{profile.linkedin}</a> : '—'}</li>
                <li><span>GitHub</span>{profile?.github ? <a href={profile.github} target="_blank" rel="noreferrer">{profile.github}</a> : '—'}</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* METRICHE */}
      <Row className="g-3">
        <Col xs={12}>
          <Card className="h-100 glass-card">
            <Card.Body>
              <h5 className="mb-3">Statistiche</h5>
              <div className="kpi-grid">
                <div className="kpi">
                  <div className="kpi-value">{enrolled.length}</div>
                  <div className="kpi-label">Iscrizioni</div>
                </div>
                <div className="kpi">
                  <div className="kpi-value">{inCorso.length}</div>
                  <div className="kpi-label">In corso</div>
                </div>
                <div className="kpi">
                  <div className="kpi-value">{completati.length}</div>
                  <div className="kpi-label">Completati</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CORSI */}
      <Row className="g-3">
        <Col xs={12}>
          <Card className="h-100 glass-card">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="mb-0">Corsi</h5>
                <Link to="/studente/corsi" className="landing-btn outline">
                  Vai a tutti i corsi
                </Link>
              </div>

              <Row className="g-3">
                {loading && enrolled.length === 0 && (
                  <Col xs={12}><div className="text-white-50">Caricamento corsi…</div></Col>
                )}

                {!loading && enrolled.length === 0 && (
                  <Col xs={12}><div className="text-white-50">Nessuna iscrizione presente.</div></Col>
                )}

                {enrolled.map(corso => (
                  <Col key={corso.id} xs={12} lg={6}>
                    <Card className="h-100 glass-card clickable-card">
                      <Card.Body>
                        <Card.Title className="courseTitle mb-1" id={`course-${corso.id}`}>
                          {corso.titolo}
                        </Card.Title>

                        <div className="small text-white-90 mb-2">
                          Docente: {corso.instructor || '—'}
                        </div>

                        {corso.descrizione && (
                          <Card.Text className="course-card-description mb-3">{corso.descrizione}</Card.Text>
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
                          {(corso.stato || '').toLowerCase() === 'attivo' ? 'In corso' : (corso.stato || '—')}
                        </small>
                        <div className="d-flex gap-2 ms-auto">
                          <Link to={`/studente/corsi/${corso.id}`} className="landing-btn primary">
                            Apri corso
                          </Link>
                          <Link to={`/studente/corsi/${corso.id}`} className="landing-btn outline">
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
