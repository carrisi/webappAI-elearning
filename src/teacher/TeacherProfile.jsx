// src/teacher/TeacherProfile.jsx
// (se il file è in src/teacher/pages/, aggiorna i path: ../../services/courses, ../../firebase)
import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './Style/TeacherProfile.css';
import './Style/TeacherCourses.css';

import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { listMyCourses } from '../services/courses';

export default function TeacherProfile() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let alive = true;

    const unsub = onAuthStateChanged(auth, async (userAuth) => {
      if (!alive) return;
      if (!userAuth) {
        setErr('Devi autenticarti per visualizzare il profilo.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErr(null);

        // users/{uid}
        const snap = await getDoc(doc(db, 'users', userAuth.uid));
        const user = snap.exists() ? snap.data() : {};

        // Normalizza nome/cognome con fallback
        const { name, surname } = normalizeNameFields(user, userAuth);

        // Corsi del docente
        const myCourses = await listMyCourses();

        if (!alive) return;
        setProfile({
          initials: computeInitials(name, surname) || '--',
          avatarUrl: user?.avatarUrl || null,
          name,
          surname,
          role: 'Docente',
          department: user?.department || 'Dipartimento',
          email: pickEmail(user?.email, userAuth?.email),
          phone: user?.phone || '',
          website: user?.website || '',
          linkedin: user?.linkedin || '',
          github: user?.github || '',
          bio: user?.bio || 'Breve biografia del docente…',
          stats: {
            courses: myCourses?.length ?? 0,
            students: safeNumber(user?.stats?.students) ?? 0,
            lastActive: fmtLastActive(userAuth),
          },
          academicYear: getAcademicYearString(new Date()),
        });
        setCourses(Array.isArray(myCourses) ? myCourses : []);
      } catch (e) {
        console.error('TeacherProfile load', e);
        if (alive) setErr('Impossibile caricare il profilo.');
      } finally {
        if (alive) setLoading(false);
      }
    });

    return () => {
      alive = false;
      unsub && unsub();
    };
  }, []);

  const taughtCourses = useMemo(() => courses || [], [courses]);

  if (loading) return <Container className="teacher-profile-view py-4 text-white">Caricamento…</Container>;
  if (err)     return <Container className="teacher-profile-view py-4 text-white">{err}</Container>;
  if (!profile) return null;

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
              <Badge bg="light" text="dark">Anno Accademico {profile.academicYear}</Badge>
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
                <li>
                  <span>Email</span>
                  {profile.email ? <a href={`mailto:${profile.email}`}>{profile.email}</a> : '—'}
                </li>
                <li>
                  <span>Telefono</span>
                  {profile.phone ? <a href={`tel:${profile.phone}`}>{profile.phone}</a> : '—'}
                </li>
                <li>
                  <span>Sito</span>
                  {profile.website ? <a href={ensureHttp(profile.website)} target="_blank" rel="noreferrer">{profile.website}</a> : '—'}
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card className="h-100 glass-card">
            <Card.Body>
              <h5 className="mb-3">Social</h5>
              <ul className="profile-list">
                <li>
                  <span>LinkedIn</span>
                  {profile.linkedin ? <a href={ensureHttp(profile.linkedin)} target="_blank" rel="noreferrer">{profile.linkedin}</a> : '—'}
                </li>
                <li>
                  <span>GitHub</span>
                  {profile.github ? <a href={ensureHttp(profile.github)} target="_blank" rel="noreferrer">{profile.github}</a> : '—'}
                </li>
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
                  <div className="kpi-value">{safeNumber(profile.stats.courses) ?? 0}</div>
                  <div className="kpi-label">Corsi attivi</div>
                </div>
                <div className="kpi">
                  <div className="kpi-value">{safeNumber(profile.stats.students) ?? 0}</div>
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
                {taughtCourses.map((corso) => {
                  const titolo = corso?.titolo ?? 'Senza titolo';
                  const descrizione = corso?.descrizione ?? '';
                  const credits = safeNumber(corso?.introduzione?.credits);
                  const semester = corso?.introduzione?.semester ?? '';
                  const stato = normalizeStatus(corso?.stato);

                  return (
                    <Col key={corso.id} xs={12} lg={6}>
                      <Card className="h-100 glass-card clickable-card">
                        <Card.Body>
                          <Card.Title className="courseTitle mb-1" id="title">
                            {titolo}
                          </Card.Title>
                          {descrizione && <Card.Text className="mb-3">{descrizione}</Card.Text>}

                          <div className="course-meta mb-2 d-flex gap-2 flex-wrap">
                            {Number.isFinite(credits) && <Badge bg="light" text="dark">{credits} CFU</Badge>}
                            {semester && <Badge bg="light" text="dark">{semester}</Badge>}
                          </div>
                        </Card.Body>
                        <Card.Footer className="d-flex align-items-center justify-content-between gap-2">
                          <small className="text-muted">{stato}</small>
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
                  );
                })}

                {taughtCourses.length === 0 && (
                  <Col xs={12}>
                    <div className="text-white-80">
                      Nessun corso creato. <Link to="/docente/corsi/nuovo" className="text-white">Crea il tuo primo corso</Link>.
                    </div>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

/* ----------------------- helpers ----------------------- */
function normalizeNameFields(userDoc, userAuth) {
  const dName = (userAuth?.displayName || '').trim();
  const [dnFirst, dnLast] = dName ? dName.split(' ') : [];
  const name = (userDoc?.name || userDoc?.firstName || dnFirst || 'Nome').trim();
  const surname = (userDoc?.surname || userDoc?.lastName || dnLast || 'Cognome').trim();
  return { name, surname };
}

function pickEmail(userEmail, authEmail) {
  const e = (userEmail || authEmail || '').trim();
  return e || '';
}

function ensureHttp(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function safeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function normalizeStatus(stato) {
  const s = typeof stato === 'string' ? stato.trim() : '';
  if (!s) return '—';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function computeInitials(name, surname) {
  const n = (name || '').trim();
  const s = (surname || '').trim();
  const i1 = n ? n[0].toUpperCase() : '';
  const i2 = s ? s[0].toUpperCase() : '';
  return (i1 + i2) || null;
}

function fmtLastActive(user) {
  const ts = user?.metadata?.lastSignInTime;
  if (!ts) return '—';
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return 'Oggi';
  return d.toLocaleDateString();
}

function getAcademicYearString(date) {
  // IT: anno accademico inizia tipicamente a settembre
  const y = date.getFullYear();
  const m = date.getMonth(); // 0-11
  const start = m >= 8 ? y : y - 1; // da Set(8) a Dic -> start = y, altrimenti y-1
  const end = String((start + 1) % 100).padStart(2, '0'); // ultime due cifre
  return `${start}/${end}`;
}
