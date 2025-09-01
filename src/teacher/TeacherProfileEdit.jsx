// src/teacher/pages/TeacherProfileEdit.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Badge, Alert, Spinner
} from 'react-bootstrap';
import './Style/TeacherProfileEdit.css';
import './Style/TeacherCourses.css';

import { auth, db } from '../firebase';

import {
  onAuthStateChanged,
  updateProfile as updateAuthProfile,
  // --- Sicurezza ---
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  updateEmail,
} from 'firebase/auth';
import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp,
} from 'firebase/firestore';

/** Helpers */
const firstPart = (full) => (full || '').trim().split(' ')[0] || '';
const lastPart  = (full) => {
  const t = (full || '').trim().split(' ');
  return t.length > 1 ? t.slice(1).join(' ') : '';
};
const normalizeUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
};

export default function TeacherProfileEdit() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  // Stato profilo (usato da form)
  const [profile, setProfile] = useState({
    name: '',
    surname: '',
    role: 'Docente',
    department: '',
    email: '',
    phone: '',
    bio: 'Breve biografia del docente…',
    website: '',
    linkedin: '',
    github: '',
  });

  // Avatar (preview locale)
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

  /** Caricamento iniziale Auth + Firestore */
  useEffect(() => {
    let alive = true;
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!alive) return;
      if (!user) {
        setErr('Devi effettuare l’accesso per modificare il profilo.');
        setLoading(false);
        return;
      }
      try {
        setErr(null); setOk(null);
        const ref  = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : {};

        const name    = data?.name    || firstPart(user.displayName) || '';
        const surname = data?.surname || lastPart(user.displayName)  || '';

        // Backfill dei campi mancanti
        if ((!data?.name || !data?.surname) && (name || surname)) {
          await setDoc(ref, {
            name: name || null,
            surname: surname || null,
            displayName: [name, surname].filter(Boolean).join(' ') || null,
            updatedAt: serverTimestamp(),
          }, { merge: true });
        }

        setProfile((p) => ({
          ...p,
          name,
          surname,
          role: data?.role === 'teacher' ? 'Docente' : (data?.role || 'Docente'),
          department: data?.department || '',
          email: data?.email || user.email || '',
          phone: data?.phone || '',
          bio: data?.bio || p.bio,
          website: data?.website || '',
          linkedin: data?.linkedin || '',
          github: data?.github || '',
        }));
      } catch (e) {
        console.error('TeacherProfileEdit load', e);
        setErr('Impossibile caricare il profilo.');
      } finally {
        setLoading(false);
      }
    });
    return () => { alive = false; unsub && unsub(); };
  }, []);

  /** Handlers base form */
  const onChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  /** Salvataggio: Dati personali */
  const [savingProfile, setSavingProfile] = useState(false);
  const onSaveProfile = async (e) => {
    e.preventDefault();
    setOk(null); setErr(null); setSavingProfile(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('not-authenticated');
      const ref = doc(db, 'users', user.uid);

      const displayName = `${(profile.name || '').trim()} ${(profile.surname || '').trim()}`.trim();
      if (displayName) {
        await updateAuthProfile(user, { displayName });
      }

      const payload = {
        name: (profile.name || '').trim(),
        surname: (profile.surname || '').trim(),
        department: (profile.department || '').trim(),
        email: (profile.email || '').trim(),
        bio: (profile.bio || '').trim(),
        displayName: displayName || null,
        updatedAt: serverTimestamp(),
      };

      try {
        await updateDoc(ref, payload);
      } catch {
        await setDoc(ref, payload, { merge: true });
      }

      setOk('Profilo aggiornato correttamente.');
    } catch (e) {
      console.error('Save profile', e);
      setErr('Errore nel salvataggio del profilo.');
    } finally {
      setSavingProfile(false);
    }
  };

  /** Salvataggio: Contatti & Social */
  const [savingContacts, setSavingContacts] = useState(false);
  const onSaveContacts = async (e) => {
    e.preventDefault();
    setOk(null); setErr(null); setSavingContacts(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('not-authenticated');
      const ref = doc(db, 'users', user.uid);

      const website  = normalizeUrl(profile.website);
      const linkedin = normalizeUrl(profile.linkedin);
      const github   = normalizeUrl(profile.github);

      await setDoc(ref, {
        phone: (profile.phone || '').trim(),
        website,
        linkedin,
        github,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setOk('Contatti aggiornati con successo.');
    } catch (e) {
      console.error('Save contacts', e);
      setErr('Errore nel salvataggio dei contatti.');
    } finally {
      setSavingContacts(false);
    }
  };

  /** ----------------------- SICUREZZA ----------------------- */
  const [pwdForm, setPwdForm] = useState({
    current: '',
    next: '',
    confirm: '',
    newEmail: '', // opzionale: aggiorna anche l’email di accesso
  });
  const [changingPwd, setChangingPwd] = useState(false);

  const onChangePassword = async (e) => {
    e.preventDefault();
    setOk(null); setErr(null); setChangingPwd(true);
    try {
      const user = auth.currentUser;
      if (!user?.email) throw new Error('not-authenticated');

      if (pwdForm.next && pwdForm.next.length < 8) {
        throw new Error('La nuova password deve avere almeno 8 caratteri.');
      }
      if (pwdForm.next !== pwdForm.confirm) {
        throw new Error('Le nuove password non coincidono.');
      }

      // Re-auth con la password attuale
      const cred = EmailAuthProvider.credential(user.email, pwdForm.current);
      await reauthenticateWithCredential(user, cred);

      // Aggiorna password (se richiesta)
      if (pwdForm.next) {
        await updatePassword(user, pwdForm.next);
      }

      // Aggiorna email (opzionale) + riflesso su Firestore
      const newEmail = (pwdForm.newEmail || '').trim();
      if (newEmail && newEmail !== user.email) {
        await updateEmail(user, newEmail);
        await setDoc(doc(db, 'users', user.uid), { email: newEmail, updatedAt: serverTimestamp() }, { merge: true });
        // Se l’email cambia, aggiorno anche il profilo in pagina
        setProfile((p) => ({ ...p, email: newEmail }));
      }

      setOk('Sicurezza aggiornata correttamente.');
      setPwdForm({ current: '', next: '', confirm: '', newEmail: '' });
    } catch (e) {
      console.error('Change password/email', e);
      // Messaggi più chiari per errori comuni
      const code = e?.code || '';
      let msg = e?.message || 'Errore di sicurezza.';
      if (code === 'auth/wrong-password') msg = 'Password attuale non corretta.';
      if (code === 'auth/weak-password') msg = 'La nuova password è troppo debole.';
      if (code === 'auth/requires-recent-login') msg = 'Per favore, riesegui l’accesso e riprova.';
      if (code === 'auth/invalid-email') msg = 'Nuova email non valida.';
      if (code === 'auth/email-already-in-use') msg = 'La nuova email è già in uso.';
      setErr(msg);
    } finally {
      setChangingPwd(false);
    }
  };

  /** Render */
  if (loading) {
    return (
      <Container className="teacher-profile-page py-4">
        <Spinner animation="border" size="sm" className="me-2" />
        <span>Caricamento…</span>
      </Container>
    );
  }

  return (
    <Container className="teacher-profile-page py-4">
      <section className="glass-hero text-white mb-4">
        <h1 className="hero-title mb-1">Profilo Docente</h1>
        <p className="hero-subtitle mb-2">
          Gestisci dati personali, preferenze e sicurezza dell’account
        </p>
        <div className="d-flex gap-2 flex-wrap justify-content-center mt-2">
          <Badge bg="light" text="dark">{profile.role || 'Docente'}</Badge>
          <Badge bg="light" text="dark">Anno Accademico 2024/25</Badge>
        </div>
      </section>

      {!!err && <Alert variant="danger" className="glass-card">{err}</Alert>}
      {!!ok &&  <Alert variant="success" className="glass-card">{ok}</Alert>}

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
                    <div className="avatar-placeholder">
                      {(profile.name?.[0] || 'A').toUpperCase()}
                      {(profile.surname?.[0] || 'D').toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2 justify-content-center">
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
          <Card className="glass-card profile-card">
            <Card.Body>
              <h5 className="mb-3">Contatti & Social</h5>
              <Form onSubmit={onSaveContacts}>
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
                  <Button type="submit" disabled={savingContacts} className="landing-btn primary">
                    {savingContacts ? 'Salvataggio…' : 'Salva contatti'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Notifiche (placeholder) */}
          <Card className="glass-card">
            <Card.Body>
              <h5 className="mb-3">Preferenze notifiche</h5>
              <div className="text-white-50">Integrazione notifiche verrà aggiunta più avanti.</div>
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
                        placeholder="Docente"
                        disabled
                        title="Il ruolo tecnico (teacher|student) è gestito dal sistema."
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
                      <Form.Text className="text-white-50">
                        L’allineamento con l’email in Auth si farà nella sezione Sicurezza.
                      </Form.Text>
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
                    placeholder="Docente appassionato di tecnologie innovative e apprendimento digitale…"
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button type="submit" disabled={savingProfile} className="landing-btn primary">
                    {savingProfile ? 'Salvataggio…' : 'Salva profilo'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Sicurezza / Password + Email */}
          <Card className="glass-card profile-card">
            <Card.Body>
              <h5 className="mb-3">Sicurezza</h5>
              <Form onSubmit={onChangePassword}>
                <Row className="g-2">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password attuale</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="••••••••"
                        value={pwdForm.current}
                        onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nuova password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Min 8 caratteri"
                        value={pwdForm.next}
                        onChange={(e) => setPwdForm({ ...pwdForm, next: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Conferma</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Ripeti"
                        value={pwdForm.confirm}
                        onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-2">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nuova email (opzionale)</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="nuova.email@ateneo.it"
                        value={pwdForm.newEmail}
                        onChange={(e) => setPwdForm({ ...pwdForm, newEmail: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2">
                  <Button type="submit" disabled={changingPwd} className="landing-btn primary">
                    {changingPwd ? 'Aggiornamento…' : 'Aggiorna sicurezza'}
                  </Button>
                </div>
              </Form>

              <hr style={{ height: 3, border: 'none', backgroundColor: 'rgba(255,255,255,.25)', borderRadius: 2 }} />

              <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2">
                <div>
                  <h6 className="mb-1">Logout da tutti i dispositivi</h6>
                  <small className="text-white-50">
                    Per sicurezza, riesegui l’accesso se richiesto.
                  </small>
                </div>
                <Button
                  variant="light"
                  className="landing-btn outline"
                  onClick={() => window.location.assign('/logout')}
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
