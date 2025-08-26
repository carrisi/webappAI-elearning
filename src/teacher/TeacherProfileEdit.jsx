// src/teacher/pages/TeacherProfile.jsx
import React, { useRef, useState } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Badge
} from 'react-bootstrap';
import './Style/TeacherProfileEdit.css';
import './Style/TeacherCourses.css'; // per coerenza di glass-hero / glass-card / btn

export default function TeacherProfileEdit() {
  // Stato mock del profilo
  const [profile, setProfile] = useState({
    name: 'Nome Docente',
    surname: 'Cognome',
    role: 'Docente',
    department: 'Dipartimento di Informatica',
    email: 'docente@example.com',
    phone: '',
    bio: 'Breve biografia del docente…',
    website: '',
    linkedin: '',
    github: '',
    notifications: {
      aiWeeklyDigest: true,
      courseEvents: true,
      studentMessages: true,
      marketing: false
    }
  });

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = useRef(null);

  const onPickAvatar = () => avatarInputRef.current?.click();
  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Handlers
  const onChange = (e) => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  };
  const onToggle = (key) => {
    setProfile(p => ({
      ...p,
      notifications: { ...p.notifications, [key]: !p.notifications[key] }
    }));
  };
  const onSaveProfile = (e) => {
    e.preventDefault();
    alert('Profilo salvato (mock).');
  };
  const onChangePassword = (e) => {
    e.preventDefault();
    alert('Password aggiornata (mock).');
  };

  return (
    <Container className="teacher-profile-page py-4">
      {/* HERO */}
      <section className="glass-hero text-white mb-4">
        <h1 className="hero-title mb-1">Profilo Docente</h1>
        <p className="hero-subtitle mb-2">
          Gestisci dati personali, preferenze e sicurezza dell’account
        </p>
        <div className="d-flex gap-2 flex-wrap justify-content-center mt-2">
          <Badge bg="light" text="dark">{profile.role}</Badge>
          <Badge bg="light" text="dark">Anno Accademico 2024/25</Badge>
        </div>
      </section>

      <Row className="g-3 align-items-stretch">
        {/* COLONNA SINISTRA */}
        <Col xs={12} lg={4}>
          {/* Avatar */}
          <Card className="glass-card profile-card">
            <Card.Body>
              <h5 className="mb-3">Avatar</h5>
              <div className="profile-avatar">
                <div className="avatar-ring">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" />
                  ) : (
                    <div className="avatar-placeholder">AD</div>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button className="landing-btn primary" onClick={onPickAvatar}>
                  Carica immagine
                </Button>
                <Button
                  variant="light"
                  className="landing-btn outline"
                  onClick={() => setAvatarPreview(null)}
                >
                  Rimuovi
                </Button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={onAvatarChange}
                />
              </div>
            </Card.Body>
          </Card>

          {/* Contatti & Social */}
          <Card className="glass-card">
            <Card.Body>
              <h5 className="mb-3">Contatti & Social</h5>
              <Form onSubmit={(e) => e.preventDefault()}>
                <Form.Group className="mb-3">
                  <Form.Label>Telefono</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="+39 …"
                    name="phone"
                    value={profile.phone}
                    onChange={onChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Sito web</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://…"
                    name="website"
                    value={profile.website}
                    onChange={onChange}
                  />
                </Form.Group>
                <Row className="g-2">
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>LinkedIn</Form.Label>
                      <Form.Control
                        type="url"
                        placeholder="https://linkedin.com/in/…"
                        name="linkedin"
                        value={profile.linkedin}
                        onChange={onChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>GitHub</Form.Label>
                      <Form.Control
                        type="url"
                        placeholder="https://github.com/…"
                        name="github"
                        value={profile.github}
                        onChange={onChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">
                  <Button className="landing-btn outline" onClick={() => alert('Salvato (mock).')}>
                    Salva contatti
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Notifiche */}
          <Card className="glass-card">
            <Card.Body>
              <h5 className="mb-3">Preferenze notifiche</h5>
              <Form>
                <Form.Check
                  type="switch"
                  id="notif-ai"
                  label="Digest settimanale AI (domande, trend, insight)"
                  checked={profile.notifications.aiWeeklyDigest}
                  onChange={() => onToggle('aiWeeklyDigest')}
                  className="mb-2"
                />
                <Form.Check
                  type="switch"
                  id="notif-course"
                  label="Eventi corso (nuove lezioni, valutazioni, scadenze)"
                  checked={profile.notifications.courseEvents}
                  onChange={() => onToggle('courseEvents')}
                  className="mb-2"
                />
                <Form.Check
                  type="switch"
                  id="notif-students"
                  label="Messaggi/segna­lazioni dagli studenti"
                  checked={profile.notifications.studentMessages}
                  onChange={() => onToggle('studentMessages')}
                  className="mb-2"
                />
                <Form.Check
                  type="switch"
                  id="notif-marketing"
                  label="Aggiornamenti marketing/prodotto"
                  checked={profile.notifications.marketing}
                  onChange={() => onToggle('marketing')}
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* COLONNA DESTRA */}
        <Col xs={12} lg={8}>
          {/* Dati personali */}
          <Card className="glass-card profile-card">
            <Card.Body>
              <h5 className="mb-3">Dati personali</h5>
              <Form onSubmit={onSaveProfile}>
                <Row className="g-2">
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={onChange}
                        placeholder="Nome"
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cognome</Form.Label>
                      <Form.Control
                        type="text"
                        name="surname"
                        value={profile.surname}
                        onChange={onChange}
                        placeholder="Cognome"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-2">
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ruolo</Form.Label>
                      <Form.Control
                        type="text"
                        name="role"
                        value={profile.role}
                        onChange={onChange}
                        placeholder="Ruolo"
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dipartimento</Form.Label>
                      <Form.Control
                        type="text"
                        name="department"
                        value={profile.department}
                        onChange={onChange}
                        placeholder="Dipartimento"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-2">
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email istituzionale</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={onChange}
                        placeholder="email@ateneo.it"
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Telefono</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={onChange}
                        placeholder="+39 …"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Biografia</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="bio"
                    value={profile.bio}
                    onChange={onChange}
                    placeholder="Racconta la tua esperienza…"
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button type="submit" className="landing-btn primary">Salva profilo</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Sicurezza / Password */}
          <Card className="glass-card">
            <Card.Body>
              <h5 className="mb-3">Sicurezza</h5>
              <Form onSubmit={onChangePassword}>
                <Row className="g-2">
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password attuale</Form.Label>
                      <Form.Control type="password" placeholder="••••••••" required />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nuova password</Form.Label>
                      <Form.Control type="password" placeholder="Nuova password" required />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Conferma nuova password</Form.Label>
                      <Form.Control type="password" placeholder="Conferma" required />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end gap-2">
                  <Button type="submit" className="landing-btn outline">Aggiorna password</Button>
                </div>
              </Form>

              <hr />

              <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2">
                <div>
                  <h6 className="mb-1">Logout da tutti i dispositivi</h6>
                  <small className="text-white-50">
                    Forza il logout su web e dispositivi mobili collegati.
                  </small>
                </div>
                <Button
                  variant="light"
                  className="landing-btn outline"
                  onClick={() => alert('Logout forzato (mock).')}
                >
                  Disconnetti ovunque
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
