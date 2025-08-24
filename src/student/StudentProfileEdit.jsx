// src/pages/StudentProfileEdit.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Style/StudentProfileEdit.css';
import './Style/MyCourses.css'; // per riuso .landing-btn primary/outline
import avatarFallback from '../assets/images/avatar-student.jpeg';

// TODO: sostituisci con lo store/auth reale
const readCurrentUser = () => ({
  id: 'u-001',
  nome: 'Alessandro',
  cognome: 'Carrisi',
  username: 'a.carrisi',
  email: 'a.carrisi3@studenti.uniba.it',
  matricola: '736830',
  corsoDiStudi: 'Informatica',
  anno: 2,
  sede: 'Bari, IT',
  bio: `Studente di Informatica appassionato di AI applicata all'e‑learning.
Costruisco front-end reattivi, integro modelli LLM e curo UX accessibile.`,
  avatar: null,
});

export default function StudentProfileEdit() {
  const navigate = useNavigate();
  const user = useMemo(readCurrentUser, []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState('');

  // form state
  const [form, setForm] = useState({
    nome: user.nome || '',
    cognome: user.cognome || '',
    username: user.username || '',
    email: user.email || '',
    matricola: user.matricola || '',
    corsoDiStudi: user.corsoDiStudi || '',
    anno: user.anno || 1,
    sede: user.sede || '',
    bio: user.bio || '',
  });

  // avatar
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || avatarFallback);

  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // preferenze
  const [prefs, setPrefs] = useState({
    newsletter: true,
    notifEmail: true,
    notifPush: false,
    profiloPubblico: false,
  });
  const onPref = (e) => {
    const { name, checked } = e.target;
    setPrefs(p => ({ ...p, [name]: checked }));
  };

  // password
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });

  const validate = () => {
    if (!form.nome.trim() || !form.cognome.trim()) return 'Nome e cognome sono obbligatori.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Email non valida.';
    if (pwd.next || pwd.confirm || pwd.current) {
      if (pwd.next.length < 8) return 'La nuova password deve avere almeno 8 caratteri.';
      if (pwd.next !== pwd.confirm) return 'Le password non coincidono.';
    }
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const v = validate();
    if (v) { setError(v); return; }

    setSaving(true);
    try {
      // TODO: chiama le tue API (upload avatarFile se presente, aggiornamento profilo, cambio password)
      await new Promise(r => setTimeout(r, 700));
      setSaved(true);
      setTimeout(() => navigate('/studente/profilo'), 600);
    } catch (err) {
      setError('Si è verificato un errore durante il salvataggio.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="student-profile-edit-page">
      <Container>
        {/* HEADER / HERO */}
        <Row className="align-items-center gy-3 mb-3">
          <Col md={8}>
            <h1 className="edit-title">Modifica profilo</h1>
            <p className="edit-sub">
              Aggiorna i tuoi dati anagrafici, l’avatar, le preferenze e la password.
            </p>
          </Col>
          <Col md={4} className="text-md-end">
            <Link to="/studente/profilo" className="landing-btn outline">Torna al profilo</Link>
          </Col>
        </Row>

        {error && <Alert variant="danger" className="glass-alert">{error}</Alert>}
        {saved && <Alert variant="success" className="glass-alert">Profilo aggiornato con successo.</Alert>}

        <Form onSubmit={onSubmit}>
          <Row className="gy-4">
            {/* Colonna Avatar */}
            <Col lg={4} md={6}>
              <Card className="glass-card p-3 edit-card">
                <h5 className="section-title">Avatar</h5>
                <div className="avatar-wrap">
                  <img src={avatarPreview} alt="Anteprima avatar" className="avatar-img" />
                </div>

                <div className="d-grid gap-2 mt-3">
                  <Form.Label className="btn-upload">
                    Carica nuova immagine
                    <Form.Control
                      type="file"
                      accept="image/*"
                      className="visually-hidden"
                      onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    />
                  </Form.Label>
                  {avatarFile && (
                    <Button
                      variant="outline-light"
                      className="btn-reset-file"
                      onClick={() => setAvatarFile(null)}
                    >
                      Rimuovi selezione
                    </Button>
                  )}
                </div>

                <small className="text-white-50 d-block mt-3">
                  Formati consigliati: JPG/PNG, max 2MB, quadrato ≥ 400×400.
                </small>
              </Card>
            </Col>

            {/* Colonna Dati anagrafici */}
            <Col lg={8} md={6}>
              <Card className="glass-card p-3 edit-card">
                <h5 className="section-title">Anagrafica</h5>

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="nome">
                      <Form.Label>Nome</Form.Label>
                      <Form.Control
                        name="nome"
                        value={form.nome}
                        onChange={onChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="cognome">
                      <Form.Label>Cognome</Form.Label>
                      <Form.Control
                        name="cognome"
                        value={form.cognome}
                        onChange={onChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        name="username"
                        value={form.username}
                        onChange={onChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="matricola">
                      <Form.Label>Matricola</Form.Label>
                      <Form.Control
                        name="matricola"
                        value={form.matricola}
                        onChange={onChange}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="sede">
                      <Form.Label>Sede</Form.Label>
                      <Form.Control
                        name="sede"
                        value={form.sede}
                        onChange={onChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="corsoDiStudi">
                      <Form.Label>Corso di studi</Form.Label>
                      <Form.Select
                        name="corsoDiStudi"
                        value={form.corsoDiStudi}
                        onChange={onChange}
                      >
                        <option>Informatica</option>
                        <option>Ingegneria Informatica</option>
                        <option>Data Science</option>
                        <option>Altro…</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="anno">
                      <Form.Label>Anno</Form.Label>
                      <Form.Select
                        name="anno"
                        value={form.anno}
                        onChange={onChange}
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group controlId="bio">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="bio"
                        value={form.bio}
                        onChange={onChange}
                        placeholder="Una breve descrizione di te…"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Colonna Preferenze & Password */}
            <Col lg={6}>
              <Card className="glass-card p-3 edit-card">
                <h5 className="section-title">Preferenze</h5>
                <Form.Check
                  type="switch"
                  id="newsletter"
                  name="newsletter"
                  label="Iscrivimi alla newsletter"
                  checked={prefs.newsletter}
                  onChange={onPref}
                />
                <Form.Check
                  type="switch"
                  id="notifEmail"
                  name="notifEmail"
                  label="Ricevi notifiche via email"
                  checked={prefs.notifEmail}
                  onChange={onPref}
                />
                <Form.Check
                  type="switch"
                  id="notifPush"
                  name="notifPush"
                  label="Ricevi notifiche push"
                  checked={prefs.notifPush}
                  onChange={onPref}
                />
                <Form.Check
                  type="switch"
                  id="profiloPubblico"
                  name="profiloPubblico"
                  label="Rendi visibile il profilo ai compagni"
                  checked={prefs.profiloPubblico}
                  onChange={onPref}
                />
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="glass-card p-3 edit-card">
                <h5 className="section-title">Sicurezza</h5>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group controlId="pwdCurrent">
                      <Form.Label>Password attuale</Form.Label>
                      <Form.Control
                        type="password"
                        value={pwd.current}
                        onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                        placeholder="••••••••"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="pwdNext">
                      <Form.Label>Nuova password</Form.Label>
                      <Form.Control
                        type="password"
                        value={pwd.next}
                        onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                        placeholder="Minimo 8 caratteri"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="pwdConfirm">
                      <Form.Label>Conferma password</Form.Label>
                      <Form.Control
                        type="password"
                        value={pwd.confirm}
                        onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                        placeholder="Ripeti la nuova password"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          {/* CTA */}
          <div className="edit-actions">
            <Link to="/studente/profilo" className="landing-btn outline">Annulla</Link>
            <button type="submit" className="landing-btn primary" disabled={saving}>
              {saving ? 'Salvataggio…' : 'Salva modifiche'}
            </button>
          </div>
        </Form>
      </Container>
    </div>
  );
}
