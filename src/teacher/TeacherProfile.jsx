import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './Style/TeacherProfile.css';
import './Style/TeacherCourses.css'; // per glass-card/hero e bottoni

import { db, auth } from '../firebase';
import {
  doc, getDoc, collection, query, where, getDocs,
} from 'firebase/firestore';

/**
 * TeacherProfile
 * Copia 1:1 della pagina StudentProfile, adattata al docente:
 * - UI/JSX identici (hero, avatar ring, bio, contatti/social, KPI, card corsi)
 * - Dati: profilo da /users/{uid}, corsi propri (courses.ownerId == uid)
 * - Rotte e label: /docente/... ; "Docente", "Dipartimento", ecc.
 */
export default function TeacherProfile() {
  const uid = auth.currentUser?.uid || null;

  const [profile, setProfile] = useState(null); // /users/{uid}
  const [taught, setTaught]   = useState([]);   // corsi insegnati (dettagli corso)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        if (!uid) return;

        // 1) Profilo utente (users/{uid})
        let p = null;
        try {
          const userSnap = await getDoc(doc(db, 'users', uid));
          if (userSnap.exists()) p = userSnap.data();
        } catch (e) {
          console.error('TeacherProfile: load user', e);
        }

        // fallback su auth (se mancano alcuni campi)
        const displayName = p?.displayName || auth.currentUser?.displayName || '';
        const [name, surname] = displayName
          ? displayName.split(' ')
          : [p?.name || '', p?.surname || ''];
        const role = 'teacher';
        const email = p?.email || auth.currentUser?.email || '';

        const hydratedProfile = {
          initials: `${(name||'').charAt(0)}${(surname||'').charAt(0)}`.toUpperCase() || 'DC',
          avatarUrl: p?.photoURL || null,
          name: name || p?.name || '',
          surname: surname || p?.surname || '',
          role: 'Docente',
          department: p?.department || '',   // equivalente "degree" dello studente
          email,
          sede: p?.campus || p?.sede || '',  // opzionale
          phone: p?.phone || '',
          website: p?.website || '',
          linkedin: p?.linkedin || '',
          github: p?.github || '',
          bio: p?.bio || '',
        };
        if (alive) setProfile(hydratedProfile);

        // 2) Corsi del docente (ownerId == uid)
        const qMine = query(collection(db, 'courses'), where('ownerId', '==', uid));
        const mineSnap = await getDocs(qMine);
        const myCourses = await Promise.all(
          mineSnap.docs.map(async (d) => {
            try {
              const c = d.data();
              const intro = c.introduzione || {};
              return {
                id: d.id,
                titolo: c.titolo || 'Corso',
                descrizione: c.descrizione || '',
                stato: c.stato || 'attivo',
                introduzione: {
                  credits: intro.credits ?? c.credits ?? undefined,
                  semester: intro.semester || c.semester || '',
                },
                instructor: intro.professor || c.professor || '', // se presente
              };
            } catch {
              return null;
            }
          })
        );

        const joined = (myCourses || []).filter(Boolean);
        if (alive) setTaught(joined);
      } catch (e) {
        console.error('TeacherProfile: load error', e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [uid]);

  const inCorso = useMemo(
    () => taught.filter(c => (c.stato || '').toLowerCase() === 'attivo'),
    [taught]
  );
  const completati = useMemo(
    () => taught.filter(c => (c.stato || '').toLowerCase() !== 'attivo'),
    [taught]
  );

  // Placeholder se non ancora caricati i dati
  const user = profile || {
    initials: '--',
    avatarUrl: null,
    name: '',
    surname: '',
    role: 'Docente',
    department: '',
    email: '',
    sede: '',
    phone: '',
    website: '',
    linkedin: '',
    github: '',
    bio: '',
  };

  return (
    <Container className="teacher-profile-view py-4">
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
              {user.role}{user.department ? <> • {user.department}</> : null}
            </p>
            <div className="badge-teacher d-flex gap-2 flex-wrap">
              <Badge bg="light" text="dark">{user.role}</Badge>
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

      {/* CONTATTI + SOCIAL */}
      <Row className="g-3">
        <Col xs={12} md={6}>
          <Card className="h-100 glass-card">
            <Card.Body>
              <h5 className="mb-3">Contatti</h5>
              <ul className="profile-list">
                <li><span>Email</span>{user.email ? <a href={`mailto:${user.email}`}>{user.email}</a> : '—'}</li>
                <li><span>Telefono</span>{user.phone ? <a href={`tel:${user.phone}`}>{user.phone}</a> : '—'}</li>
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
                <li><span>Website</span>{user.website ? <a href={ensureHttp(user.website)} target="_blank" rel="noreferrer">{user.website}</a> : '—'}</li>
                <li><span>LinkedIn</span>{user.linkedin ? <a href={ensureHttp(user.linkedin)} target="_blank" rel="noreferrer">{user.linkedin}</a> : '—'}</li>
                <li><span>GitHub</span>{user.github ? <a href={ensureHttp(user.github)} target="_blank" rel="noreferrer">{user.github}</a> : '—'}</li>
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
                  <div className="kpi-value">{taught.length}</div>
                  <div className="kpi-label">Corsi creati</div>
                </div>
                <div className="kpi">
                  <div className="kpi-value">{inCorso.length}</div>
                  <div className="kpi-label">Attivi</div>
                </div>
                <div className="kpi">
                  <div className="kpi-value">{completati.length}</div>
                  <div className="kpi-label">Concluse</div>
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
                <Link to="/docente/corsi" className="landing-btn outline">
                  Vai a tutti i corsi
                </Link>
              </div>

              <Row className="g-3">
                {loading && taught.length === 0 && (
                  <Col xs={12}><div className="text-white-50">Caricamento corsi…</div></Col>
                )}

                {!loading && taught.length === 0 && (
                  <Col xs={12}>
                    <div className="text-white-50">
                      Nessun corso creato.
                    </div>
                  </Col>
                )}

                {taught.map(corso => (
                  <Col key={corso.id} xs={12} lg={6}>
                    <Card className="h-100 glass-card clickable-card">
                      <Card.Body>
                        <Card.Title className="courseTitle mb-1" id={`course-${corso.id}`}>
                          {corso.titolo}
                        </Card.Title>

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

/* helpers */
function ensureHttp(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}
