// src/pages/ExploreCourses.jsx
import React, { useMemo, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Badge, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import heroImg from '../assets/images/hero-elearning.png';
import './Style/ExploreCourses.css';

// Servizi Firestore
import { listPublicCourses } from '../services/courses';
import { listMyEnrollments } from '../services/enrollments';
import { createAccessRequest, getMyAccessRequest } from '../services/accessRequests';

// --- util livello -> classi ---
function levelClassName(livello = '') {
  const lv = (livello || '').toLowerCase();
  if (lv.startsWith('prin')) return 'beginner';
  if (lv.startsWith('inter')) return 'intermediate';
  if (lv.startsWith('avan')) return 'advanced';
  return 'default';
}

// --- Modal flat coerente con TeacherAssessments ---
function SimpleModal({ show, onHide, title, children, actions, size = "lg" }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size={size}
      dialogClassName="glass-wrap-modal"
      contentClassName="modal-surface"
      backdropClassName="soft-backdrop"
    >
      <div className="modal-surface-inner">
        <div className="modal-row-top">
          <div className="modal-title">{title}</div>
          <button className="modal-close-btn" aria-label="Chiudi" onClick={onHide}>✕</button>
        </div>
        <div className="modal-content-flat">
          {children}
        </div>
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </Modal>
  );
}

// --- Card singola corso ---
function CourseCard({ corso, isEnrolled, onOpen }) {
  const lvlClass = levelClassName(corso?.introduzione?.level || corso.livello);

  return (
    <Card className="h-100 glass-card clickable-card position-relative">
      {(corso?.introduzione?.level || corso.livello) && (
        <span className={`pill pill-level ${lvlClass}`}>{corso?.introduzione?.level || corso.livello}</span>
      )}
      <span className={`pill pill-enrollment ${isEnrolled ? 'pill-enrolled' : 'pill-not-enrolled'}`}>
        {isEnrolled ? 'Iscritto' : 'Non iscritto'}
      </span>

      <Card.Body className="course-body">
        <Card.Title className="courseTitle mb-1">{corso.titolo || 'Senza titolo'}</Card.Title>
        <div className="small text-muted mb-2">Docente: {corso.introduzione?.professor || corso.professor || '—'}</div>

        {corso.descrizione && (
          <Card.Text className="mb-3 courseDescription">{corso.descrizione}</Card.Text>
        )}

        <div className="course-meta mb-2">
          {Number.isFinite(Number(corso?.introduzione?.credits)) && (
            <Badge bg="light" text="dark">{Number(corso.introduzione.credits)} CFU</Badge>
          )}
          {corso?.introduzione?.semester && (
            <Badge bg="light" text="dark" className='courseSemester'>{corso.introduzione.semester}</Badge>
          )}
        </div>

        <div className="course-tags mb-3">
          {(corso.tags || []).slice(0, 6).map(t => (
            <Badge key={t} bg="light" text="dark">#{t}</Badge>
          ))}
        </div>

        <div className="d-flex justify-content-end">
          <Button className="btn-glass" onClick={() => onOpen(corso)}>
            Dettagli e richiesta
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default function ExploreCourses() {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  // UI state filtri/sort
  const [q, setQ] = useState(params.get('q') || '');
  const [level, setLevel] = useState('Tutti');
  const [semester, setSemester] = useState('Tutti');
  const [enrollFilter, setEnrollFilter] = useState('Tutti');
  const [cfuMin, setCfuMin] = useState('');
  const [cfuMax, setCfuMax] = useState('');
  const [sortBy, setSortBy] = useState('Rilevanza');

  // Dati da Firestore
  const [catalog, setCatalog] = useState([]);
  const [enrollments, setEnrollments] = useState([]);   // miei enrollment
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => { setQ(params.get('q') || ''); }, [params]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true); setErr(null);
        const [pubCourses, myEnrolls] = await Promise.all([
          listPublicCourses(),
          listMyEnrollments()
        ]);
        if (!alive) return;
        setCatalog(pubCourses || []);
        setEnrollments(myEnrolls || []);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setErr('Impossibile caricare il catalogo corsi.');
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Set utili
  const enrolledIds = useMemo(() =>
    new Set((enrollments || [])
      .filter(e => e.status === 'active')
      .map(e => e.courseId)), [enrollments]);

  // Opzioni dinamiche
  const allLevels = useMemo(() => {
    const s = new Set(
      catalog.map(c => c?.introduzione?.level || c.livello).filter(Boolean)
    );
    return ['Tutti', ...Array.from(s).sort()];
  }, [catalog]);

  const allSemesters = useMemo(() => {
    const s = new Set(catalog.map(c => c.introduzione?.semester).filter(Boolean));
    return ['Tutti', ...Array.from(s).sort()];
  }, [catalog]);

  // Statistiche top
  const stats = useMemo(() => {
    const total = catalog.length;

    const byLevel = { Principiante: 0, Intermedio: 0, Avanzato: 0, Altro: 0 };
    catalog.forEach(c => {
      const lv = (c?.introduzione?.level || c.livello || '').toLowerCase();
      if (lv.startsWith('prin')) byLevel.Principiante++;
      else if (lv.startsWith('inter')) byLevel.Intermedio++;
      else if (lv.startsWith('avan')) byLevel.Avanzato++;
      else byLevel.Altro++;
    });

    const byCFU = new Map();
    catalog.forEach(c => {
      const cf = Number(c.introduzione?.credits);
      if (!Number.isFinite(cf)) return;
      byCFU.set(cf, (byCFU.get(cf) || 0) + 1);
    });
    const cfuList = [...byCFU.entries()].sort((a, b) => a[0] - b[0]);

    const bySem = new Map();
    catalog.forEach(c => {
      const s = c.introduzione?.semester;
      if (!s) return;
      bySem.set(s, (bySem.get(s) || 0) + 1);
    });
    const semList = [...bySem.entries()];

    return { total, byLevel, cfuList, semList };
  }, [catalog]);

  // Ricerca e filtri
  const relevanceScore = (c, term) => {
    if (!term) return 0;
    const t = term.toLowerCase();
    let score = 0;
    if (c.titolo?.toLowerCase().includes(t)) score += 3;
    if (c.introduzione?.professor?.toLowerCase().includes(t)) score += 2;
    if (c.descrizione?.toLowerCase().includes(t)) score += 1;
    if ((c.tags || []).some(x => String(x).toLowerCase().includes(t))) score += 1;
    return score;
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (catalog || []).filter(c => {
      const matchText =
        !term ||
        c.titolo?.toLowerCase().includes(term) ||
        c.introduzione?.professor?.toLowerCase().includes(term) ||
        c.descrizione?.toLowerCase().includes(term) ||
        (c.tags || []).some(t => String(t).toLowerCase().includes(term));

      const lvl = c?.introduzione?.level || c.livello;
      const matchLevel = level === 'Tutti' || lvl === level;

      const sem = c.introduzione?.semester;
      const matchSem = semester === 'Tutti' || sem === semester;

      const credits = Number(c.introduzione?.credits);
      const minOk = cfuMin === '' || (!Number.isNaN(credits) && credits >= Number(cfuMin));
      const maxOk = cfuMax === '' || (!Number.isNaN(credits) && credits <= Number(cfuMax));

      const enrolled = enrolledIds.has(c.id);
      const matchEnroll =
        enrollFilter === 'Tutti' ||
        (enrollFilter === 'Iscritti' && enrolled) ||
        (enrollFilter === 'Non iscritti' && !enrolled);

      return matchText && matchLevel && matchSem && minOk && maxOk && matchEnroll;
    });
  }, [catalog, q, level, semester, cfuMin, cfuMax, enrollFilter, enrolledIds]);

  const results = useMemo(() => {
    const term = q.trim();
    const arr = [...filtered];
    const compareAlpha = (a, b, key) =>
      (a[key] || '').localeCompare(b[key] || '', 'it', { sensitivity: 'base' });

    switch (sortBy) {
      case 'Titolo A→Z': arr.sort((a, b) => compareAlpha(a, b, 'titolo')); break;
      case 'Titolo Z→A': arr.sort((a, b) => compareAlpha(b, a, 'titolo')); break;
      case 'Docente A→Z': arr.sort((a, b) => (a.introduzione?.professor || '').localeCompare(b.introduzione?.professor || '', 'it', { sensitivity: 'base' })); break;
      case 'CFU ↑': arr.sort((a, b) => (Number(a.introduzione?.credits) || 0) - (Number(b.introduzione?.credits) || 0)); break;
      case 'CFU ↓': arr.sort((a, b) => (Number(b.introduzione?.credits) || 0) - (Number(a.introduzione?.credits) || 0)); break;
      case 'Livello': arr.sort((a, b) => (a?.introduzione?.level || a.livello || '').localeCompare(b?.introduzione?.level || b.livello || '', 'it', { sensitivity: 'base' })); break;
      case 'Rilevanza':
      default:
        if (!term) arr.sort((a, b) => compareAlpha(a, b, 'titolo'));
        else arr.sort((a, b) => relevanceScore(b, term) - relevanceScore(a, term));
        break;
    }
    return arr;
  }, [filtered, sortBy, q]);

  // Modale richiesta
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Stato richiesta già esistente per il corso selezionato
  const [myReq, setMyReq] = useState(null);
  const [reqLoading, setReqLoading] = useState(false);

  // Carica la mia eventuale richiesta quando apro il modale
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!selected?.id) { setMyReq(null); return; }
      try {
        setReqLoading(true);
        const r = await getMyAccessRequest(selected.id);
        if (!alive) return;
        setMyReq(r);
      } catch (e) {
        console.error(e);
      } finally {
        if (!alive) return;
        setReqLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [selected?.id]);

  const handleRequest = async () => {
    if (!selected || sending) return;
    try {
      setSending(true);
      const created = await createAccessRequest(selected.id, note);
      setSent(true);
      setMyReq(created);
    } catch (e) {
      console.error(e);
      const map = {
        "already-pending": "Hai già una richiesta in attesa per questo corso.",
        "already-approved": "La richiesta è già approvata.",
        "already-rejected": "La richiesta è stata rifiutata dal docente.",
      };
      setErr(map[e.message] || 'Errore durante la richiesta di accesso.');
    } finally {
      setSending(false);
    }
  };

  const closeModal = () => {
    setSelected(null);
    setNote('');
    setSending(false);
    setSent(false);
    setExpanded(false);
    setMyReq(null);
    setReqLoading(false);
  };

  const resetFilters = () => {
    setLevel('Tutti'); setSemester('Tutti'); setEnrollFilter('Tutti');
    setCfuMin(''); setCfuMax(''); setSortBy('Rilevanza');
  };

  if (loading) {
    return (
      <div className="explore-page">
        <Container className="px-0 py-4">
          <Spinner animation="border" size="sm" className="me-2" />
          <span className="text-white">Caricamento catalogo…</span>
        </Container>
      </div>
    );
  }

  return (
    <div className="explore-page">
      <section className="explore-hero">
        <Container className="px-0">
          <Row className="align-items-center gy-4">
            <Col md={6} className="hero-left">
              <h1 className="hero-title">Esplora nuovi corsi</h1>
              <p className="hero-sub">Scopri il catalogo completo, filtra per livello, semestre e CFU e invia una richiesta di accesso.</p>
              <div className="hero-cta d-flex gap-2">
                <a href="#explore-filters" className="landing-btn primary">Inizia la ricerca</a>
                <a href="/studente/corsi" className="landing-btn outline">Scopri i miei corsi</a>
              </div>
            </Col>
            <Col md={6} className="hero-right">
              <img src={heroImg} alt="E-learning illustration" className="hero-illustration" />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="howto-banner">
        <div className="howto-inner">
          <h3>Come cercare velocemente</h3>
          <ol className="howto-steps">
            <li>Digita <strong>titolo</strong>, <strong>docente</strong> o un <strong>#tag</strong> nella barra di ricerca.</li>
            <li>Filtra per <strong>Livello</strong>, <strong>Semestre</strong> e <strong>CFU</strong>.</li>
            <li>Apri <strong>Dettagli</strong> e invia la <strong>richiesta</strong> con un messaggio opzionale al docente.</li>
          </ol>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card kpi">
            <div className="stat-kpi">{stats.total}</div>
            <div className="stat-label">Corsi totali</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Per CFU</div>
            <div className="stat-chips">
              {stats.cfuList.map(([cfu, count]) => (
                <button key={cfu} className="chip" onClick={() => { setCfuMin(String(cfu)); setCfuMax(String(cfu)); }}>
                  {cfu} CFU <span className="chip-badge">{count}</span>
                </button>
              ))}
            </div>
          </div>

            <div className="stat-card">
              <div className="stat-title">Per semestre</div>
              <div className="stat-chips">
                {stats.semList.map(([sem, count]) => (
                  <button key={sem} className="chip" onClick={() => setSemester(sem)}>
                    {sem} <span className="chip-badge">{count}</span>
                  </button>
                ))}
              </div>
            </div>
        </div>
      </section>

      <div id="explore-filters" />

      <Container className="px-0">
        {!!err && <Alert variant="danger" className="glass-card">{err}</Alert>}

        {/* Filtri */}
        <Form className="mb-4 filters-bar">
          <Row className="g-3 align-items-end">
            <Col xs={12} lg={4}>
              <Form.Control
                type="search"
                placeholder="Cerca per titolo, docente o tag…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onBlur={() => setQ(v => v.trim())}
                aria-label="Ricerca"
              />
            </Col>

            <Col xs={6} md={4} lg={2}>
              <Form.Select aria-label="Livello" value={level === 'Tutti' ? '' : level} onChange={(e) => setLevel(e.target.value || 'Tutti')}>
                <option value="" disabled hidden>Livello</option>
                <option value="Tutti">Tutti</option>
                {allLevels.filter(v => v !== 'Tutti').map(v => (<option key={v} value={v}>{v}</option>))}
              </Form.Select>
            </Col>

            <Col xs={6} md={4} lg={2}>
              <Form.Select aria-label="Semestre" value={semester === 'Tutti' ? '' : semester} onChange={(e) => setSemester(e.target.value || 'Tutti')}>
                <option value="" disabled hidden>Semestre</option>
                <option value="Tutti">Tutti</option>
                {allSemesters.filter(v => v !== 'Tutti').map(v => (<option key={v} value={v}>{v}</option>))}
              </Form.Select>
            </Col>

            <Col xs={6} md={3} lg={2}>
              <Form.Control type="number" min={0} placeholder="CFU min (es. 3)" value={cfuMin} onChange={(e) => setCfuMin(e.target.value)} aria-label="CFU min" />
            </Col>

            <Col xs={6} md={3} lg={2}>
              <Form.Control type="number" min={0} placeholder="CFU max (es. 12)" value={cfuMax} onChange={(e) => setCfuMax(e.target.value)} aria-label="CFU max" />
            </Col>

            <Col xs={12} md={6} lg={3}>
              <Form.Select aria-label="Iscrizione" value={enrollFilter === 'Tutti' ? '' : enrollFilter} onChange={(e) => setEnrollFilter(e.target.value || 'Tutti')}>
                <option value="" disabled hidden>Iscrizione</option>
                <option value="Tutti">Tutti</option>
                <option value="Iscritti">Iscritti</option>
                <option value="Non iscritti">Non iscritti</option>
              </Form.Select>
            </Col>

            <Col xs={12} md={6} lg={3}>
              <Form.Select aria-label="Ordina per" value={sortBy === 'Rilevanza' ? '' : sortBy} onChange={(e) => setSortBy(e.target.value || 'Rilevanza')}>
                <option value="" disabled hidden>Ordina per</option>
                <option value="Rilevanza">Rilevanza</option>
                <option value="Titolo A→Z">Titolo A→Z</option>
                <option value="Titolo Z→A">Titolo Z→A</option>
                <option value="Docente A→Z">Docente A→Z</option>
                <option value="CFU ↑">CFU ↑</option>
                <option value="CFU ↓">CFU ↓</option>
                <option value="Livello">Livello</option>
              </Form.Select>
            </Col>

            <Col xs="auto" className='d-flex'>
              <Button type="button" className="btn-glass-outline btn-reset" onClick={resetFilters}>
                Reset
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Lista corsi */}
        <Row className="g-4">
          {results.map(corso => {
            const isEnrolled = enrolledIds.has(corso.id);
            return (
              <Col key={corso.id} xs={12} md={6} lg={4}>
                <CourseCard corso={corso} isEnrolled={isEnrolled} onOpen={setSelected} />
              </Col>
            );
          })}
          {results.length === 0 && (
            <Col><p className="text-center m-0">Nessun corso trovato con i filtri correnti.</p></Col>
          )}
        </Row>
      </Container>

      {/* Modale Dettagli + Richiesta */}
      <SimpleModal
        show={!!selected}
        onHide={closeModal}
        title={selected?.titolo || "Dettagli corso"}
        actions={
          <>
            <Button variant="light" className="landing-btn outline" onClick={closeModal} disabled={sending}>Chiudi</Button>
            <Button
              variant="light"
              className="landing-btn primary"
              onClick={handleRequest}
              disabled={
                sending ||
                sent ||
                (selected?.id && enrolledIds.has(selected.id)) ||
                reqLoading ||
                (myReq && ["pending", "approved"].includes(myReq.status))
              }
              title={
                (selected?.id && enrolledIds.has(selected.id))
                  ? "Sei già iscritto al corso"
                  : myReq?.status === "pending"
                  ? "Richiesta già inviata"
                  : myReq?.status === "approved"
                  ? "Richiesta approvata"
                  : undefined
              }
            >
              {sent ? 'Richiesta inviata' : (sending ? 'Invio…' : 'Richiedi accesso')}
            </Button>
          </>
        }
      >
        {!selected ? null : (
          <div className="course-detail">
            <p className="text-muted mb-4">
              Docente: <strong>{selected.introduzione?.professor || '—'}</strong> ·
              {Number.isFinite(Number(selected.introduzione?.credits)) && <> CFU: <strong>{Number(selected.introduzione.credits)}</strong></>}
              {selected.introduzione?.semester && <> · Semestre: <strong>{selected.introduzione.semester}</strong></>}
            </p>

            {/* Descrizione con Mostra altro/Meno */}
            {selected?.descrizione && (
              <>
                <p className={`course-description ${expanded ? 'expanded' : 'collapsed'}`}>
                  <p className='text-muted mb-0'>Descrizione: </p>
                  <span>{selected.descrizione}</span>
                </p>
                <Button
                  variant="link"
                  className="toggle-description mb-4 pt-0"
                  onClick={() => setExpanded(v => !v)}
                >
                  {expanded ? 'Mostra meno' : 'Mostra altro'}
                </Button>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Messaggio (opzionale) per il docente</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Scrivi una breve nota…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={reqLoading || (myReq && ["pending","approved"].includes(myReq.status))}
              />
            </Form.Group>
            {sent && <div className="text-success fw-semibold mt-2">Richiesta creata. Potrai vedere lo stato nella tua area corsi.</div>}
          </div>
        )}
      </SimpleModal>
    </div>
  );
}
