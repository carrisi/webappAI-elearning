// src/pages/ExploreCourses.jsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Badge, Button, Modal
} from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import enrolledCourses from '../data/mockCourses';
import catalogRaw from '../data/mockCatalog';
import './Style/ExploreCourses.css';
import '../components/component-style/MyNavBar.css';
import './Style/MyCourses.css';

import heroImg from '../assets/images/hero-elearning.png'

function levelClassName(livello = '') {
  const lv = (livello || '').toLowerCase();
  if (lv.startsWith('prin')) return 'beginner';
  if (lv.startsWith('inter')) return 'intermediate';
  if (lv.startsWith('avan')) return 'advanced';
  return 'default';
}

// --- Card singola (stile come MyCourses: senza immagine) ---
function CourseCard({ corso, isEnrolled, onRequest }) {
  const lvlClass = levelClassName(corso.livello);

  return (
    <Card className="h-100 glass-card clickable-card position-relative">
      {/* Pills in alto: livello (sx) e stato iscrizione (dx) */}
      {corso.livello && (
        <span className={`pill pill-level ${lvlClass}`}>{corso.livello}</span>
      )}
      <span className={`pill pill-enrollment ${isEnrolled ? 'pill-enrolled' : 'pill-not-enrolled'}`}>
        {isEnrolled ? 'Iscritto' : 'Non iscritto'}
      </span>

      {/* >>> padding-top per evitare sovrapposizione col titolo */}
      <Card.Body className="course-body">
        {/* Titolo sotto i pill */}
        <Card.Title className="courseTitle mb-1">{corso.titolo}</Card.Title>

        <div className="small text-muted mb-2">Docente: {corso.instructor}</div>

        {corso.descrizione && (
          <Card.Text className="mb-3">{corso.descrizione}</Card.Text>
        )}

        {/* 1) DETTAGLI (CFU, semestre) - riga dedicata */}
        <div className="course-meta mb-2">
          {Number.isFinite(corso?.introduzione?.credits) && (
            <Badge bg="light" text="dark">{corso.introduzione.credits} CFU</Badge>
          )}
          {corso?.introduzione?.semester && (
            <Badge bg="light" text="dark">{corso.introduzione.semester}</Badge>
          )}
        </div>

        {/* 2) HASHTAG - riga dedicata */}
        <div className="course-tags mb-3">
          {(corso.tags || []).slice(0, 6).map(t => (
            <Badge key={t} bg="light" text="dark">#{t}</Badge>
          ))}
        </div>

        <div className="d-flex justify-content-end">
          <Button className="btn-glass" onClick={() => onRequest(corso)}>
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

  // filtri/sort (senza selezione tag)
  const [q, setQ] = useState(params.get('q') || '');
  const [level, setLevel] = useState('Tutti');
  const [semester, setSemester] = useState('Tutti');
  const [enrollFilter, setEnrollFilter] = useState('Tutti'); // Tutti | Iscritti | Non iscritti
  const [cfuMin, setCfuMin] = useState('');
  const [cfuMax, setCfuMax] = useState('');
  const [sortBy, setSortBy] = useState('Rilevanza');

  useEffect(() => {
    setQ(params.get('q') || '');
  }, [params]);

  // dedup catalogo
  const catalog = useMemo(() => {
    const map = new Map();
    (catalogRaw || []).forEach(c => map.set(c.id, c));
    return Array.from(map.values());
  }, []);

  const enrolledIds = useMemo(() => new Set((enrolledCourses || []).map(c => c.id)), []);

  const allLevels = useMemo(() => {
    const s = new Set(catalog.map(c => c.livello).filter(Boolean));
    return ['Tutti', ...Array.from(s).sort()];
  }, [catalog]);

  const allSemesters = useMemo(() => {
    const s = new Set(catalog.map(c => c.introduzione?.semester).filter(Boolean));
    return ['Tutti', ...Array.from(s).sort()];
  }, [catalog]);

  const stats = useMemo(() => {
    const total = catalog.length;

    // livelli
    const byLevel = { Principiante: 0, Intermedio: 0, Avanzato: 0, Altro: 0 };
    catalog.forEach(c => {
      const lv = (c.livello || '').toLowerCase();
      if (lv.startsWith('prin')) byLevel.Principiante++;
      else if (lv.startsWith('inter')) byLevel.Intermedio++;
      else if (lv.startsWith('avan')) byLevel.Avanzato++;
      else byLevel.Altro++;
    });

    // CFU (per valore effettivo presente)
    const byCFU = new Map();
    catalog.forEach(c => {
      const cf = Number(c.introduzione?.credits);
      if (!Number.isFinite(cf)) return;
      byCFU.set(cf, (byCFU.get(cf) || 0) + 1);
    });
    const cfuList = [...byCFU.entries()].sort((a, b) => a[0] - b[0]); // [[6,4], [9,2], …]

    // Semestre
    const bySem = new Map();
    catalog.forEach(c => {
      const s = c.introduzione?.semester;
      if (!s) return;
      bySem.set(s, (bySem.get(s) || 0) + 1);
    });
    const semList = [...bySem.entries()]; // [[“primo semestre”, 5], …]

    return { total, byLevel, cfuList, semList };
  }, [catalog]);


  const relevanceScore = (c, term) => {
    if (!term) return 0;
    const t = term.toLowerCase();
    let score = 0;
    if (c.titolo?.toLowerCase().includes(t)) score += 3;
    if (c.instructor?.toLowerCase().includes(t)) score += 2;
    if (c.descrizione?.toLowerCase().includes(t)) score += 1;
    if ((c.tags || []).some(x => x.toLowerCase().includes(t))) score += 1;
    return score;
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();

    return catalog.filter(c => {
      const matchText =
        !term ||
        c.titolo?.toLowerCase().includes(term) ||
        c.instructor?.toLowerCase().includes(term) ||
        c.descrizione?.toLowerCase().includes(term) ||
        (c.tags || []).some(t => t.toLowerCase().includes(term));

      const matchLevel = level === 'Tutti' || c.livello === level;

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
      case 'Titolo A→Z':
        arr.sort((a, b) => compareAlpha(a, b, 'titolo'));
        break;
      case 'Titolo Z→A':
        arr.sort((a, b) => compareAlpha(b, a, 'titolo'));
        break;
      case 'Docente A→Z':
        arr.sort((a, b) => compareAlpha(a, b, 'instructor'));
        break;
      case 'CFU ↑':
        arr.sort(
          (a, b) => (Number(a.introduzione?.credits) || 0) - (Number(b.introduzione?.credits) || 0)
        );
        break;
      case 'CFU ↓':
        arr.sort(
          (a, b) => (Number(b.introduzione?.credits) || 0) - (Number(a.introduzione?.credits) || 0)
        );
        break;
      case 'Livello':
        arr.sort((a, b) => compareAlpha(a, b, 'livello'));
        break;
      case 'Rilevanza':
      default:
        if (!term) {
          arr.sort((a, b) => compareAlpha(a, b, 'titolo'));
        } else {
          arr.sort((a, b) => relevanceScore(b, term) - relevanceScore(a, term));
        }
        break;
    }
    return arr;
  }, [filtered, sortBy, q]);

  // modale
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendRequest = () => {
    setSending(true);
    setTimeout(() => {
      setSent(true);
      setSending(false);
    }, 700);
  };

  const closeModal = () => {
    setSelected(null);
    setNote('');
    setSending(false);
    setSent(false);
  };

  const resetFilters = () => {
    setLevel('Tutti');
    setSemester('Tutti');
    setEnrollFilter('Tutti');
    setCfuMin('');
    setCfuMax('');
    setSortBy('Rilevanza');
  };

  return (
    <div className="explore-page">
      <section className="explore-hero">
        <Container className="px-0">
          <Row className="align-items-center gy-4">
            <Col md={6} className="hero-left">
              <h1 className="hero-title">Esplora nuovi corsi</h1>
              <p className="hero-sub">
                Scopri il catalogo completo, filtra per livello, semestre e CFU e invia una richiesta di accesso.
              </p>

              <div className="hero-cta d-flex gap-2">
                <a href="#explore-filters" className="landing-btn primary">
                  Inizia la ricerca
                </a>
                <a href="/studente/corsi" className="landing-btn outline">
                  Scopri i miei corsi
                </a>
              </div>

            </Col>

            <Col md={6} className="hero-right">
              <img src={heroImg} alt="E-learning illustration" className="hero-illustration" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- HOW TO SEARCH --- */}
      <section className="howto-banner">
        <div className="howto-inner">
          <h3>Come cercare velocemente</h3>
          <ol className="howto-steps">
            <li>Digita <strong>titolo</strong>, <strong>docente</strong> o un <strong>#tag</strong> nella barra di ricerca.</li>
            <li>Filtra per <strong>Livello</strong>, <strong>Semestre</strong> e <strong>CFU</strong> per restringere i risultati.</li>
            <li>Apri <strong>Dettagli</strong> e invia la <strong>richiesta</strong> con un messaggio opzionale al docente.</li>
          </ol>
        </div>
      </section>

      {/* --- STATISTICHE CATALOGO --- */}
      <section className="stats-section">
        <div className="stats-grid">
          {/* KPI totale */}
          <div className="stat-card kpi">
            <div className="stat-kpi">{stats.total}</div>
            <div className="stat-label">Corsi totali</div>
          </div>

          {/* Per livello */}
          <div className="stat-card">
            <div className="stat-title">Per livello</div>
            <div className="stat-chips">
              {stats.byLevel.Principiante > 0 && (
                <button className="chip chip-lv-beginner" onClick={() => setLevel('Principiante')}>
                  Principiante <span className="chip-badge">{stats.byLevel.Principiante}</span>
                </button>
              )}
              {stats.byLevel.Intermedio > 0 && (
                <button className="chip chip-lv-intermediate" onClick={() => setLevel('Intermedio')}>
                  Intermedio <span className="chip-badge">{stats.byLevel.Intermedio}</span>
                </button>
              )}
              {stats.byLevel.Avanzato > 0 && (
                <button className="chip chip-lv-advanced" onClick={() => setLevel('Avanzato')}>
                  Avanzato <span className="chip-badge">{stats.byLevel.Avanzato}</span>
                </button>
              )}
            </div>
          </div>
            
          {/* Per CFU */}
          <div className="stat-card">
            <div className="stat-title">Per CFU</div>
            <div className="stat-chips">
              {stats.cfuList.map(([cfu, count]) => (
                <button
                  key={cfu}
                  className="chip"
                  onClick={() => { setCfuMin(String(cfu)); setCfuMax(String(cfu)); }}
                  title={`Filtra per ${cfu} CFU`}
                >
                  {cfu} CFU <span className="chip-badge">{count}</span>
                </button>
              ))}
            </div>
          </div>
            
          {/* Per semestre (opzionale, a tutta riga se vuoi) */}
          {stats.semList.length > 0 && (
            <div className="stat-card stat-span">
              <div className="stat-title">Per semestre</div>
              <div className="stat-chips">
                {stats.semList.map(([sem, count]) => (
                  <button
                    key={sem}
                    className="chip"
                    onClick={() => setSemester(sem)}
                    title={`Filtra per ${sem}`}
                  >
                    {sem} <span className="chip-badge">{count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ancora per scroll */}
      <div id="explore-filters" />

      <Container className="px-0">
        {/* Filtri solo con placeholder, senza “Applica” */}
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
              <Form.Select
                aria-label="Livello"
                value={level === 'Tutti' ? '' : level}
                onChange={(e) => setLevel(e.target.value || 'Tutti')}
              >
                <option value="" disabled hidden>Livello</option>
                <option value="Tutti">Tutti</option>
                {allLevels.filter(v => v !== 'Tutti').map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </Form.Select>
            </Col>
              
            <Col xs={6} md={4} lg={2}>
              <Form.Select
                aria-label="Semestre"
                value={semester === 'Tutti' ? '' : semester}
                onChange={(e) => setSemester(e.target.value || 'Tutti')}
              >
                <option value="" disabled hidden>Semestre</option>
                <option value="Tutti">Tutti</option>
                {allSemesters.filter(v => v !== 'Tutti').map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </Form.Select>
            </Col>
              
            <Col xs={6} md={3} lg={2}>
              <Form.Control
                type="number"
                min={0}
                placeholder="CFU min (es. 3)"
                value={cfuMin}
                onChange={(e) => setCfuMin(e.target.value)}
                aria-label="CFU min"
              />
            </Col>
              
            <Col xs={6} md={3} lg={2}>
              <Form.Control
                type="number"
                min={0}
                placeholder="CFU max (es. 12)"
                value={cfuMax}
                onChange={(e) => setCfuMax(e.target.value)}
                aria-label="CFU max"
              />
            </Col>
              
            <Col xs={12} md={6} lg={3}>
              <Form.Select
                aria-label="Iscrizione"
                value={enrollFilter === 'Tutti' ? '' : enrollFilter}
                onChange={(e) => setEnrollFilter(e.target.value || 'Tutti')}
              >
                <option value="" disabled hidden>Iscrizione</option>
                <option value="Tutti">Tutti</option>
                <option value="Iscritti">Iscritti</option>
                <option value="Non iscritti">Non iscritti</option>
              </Form.Select>
            </Col>
              
            <Col xs={12} md={6} lg={3}>
              <Form.Select
                aria-label="Ordina per"
                value={sortBy === 'Rilevanza' ? '' : sortBy}
                onChange={(e) => setSortBy(e.target.value || 'Rilevanza')}
              >
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
              
            {/* Reset a larghezza naturale */}
            <Col xs="auto" className='d-flex'>
              <Button
                type="button"
                className="btn-glass-outline btn-reset"
                onClick={resetFilters}
              >
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
                <CourseCard corso={corso} isEnrolled={isEnrolled} onRequest={setSelected} />
              </Col>
            );
          })}
          {results.length === 0 && (
            <Col><p className="text-center m-0">Nessun corso trovato con i filtri correnti.</p></Col>
          )}
        </Row>
      </Container>

      {/* Modale */}
      <Modal
        show={!!selected}
        onHide={closeModal}
        centered
        contentClassName="glass-modal"       // effetto glass sul contenuto
        backdropClassName="glass-backdrop"   // backdrop morbido + blur
      >
        {!sent ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="text-white">{selected?.titolo}</Modal.Title>
            </Modal.Header>
        
            <Modal.Body>
              {selected && (
                <>
                  <p className="mb-1 text-white-50">Docente: {selected.instructor}</p>
                  <p className="mb-3 text-white">{selected.descrizione}</p>
              
                  <ul className="modal-meta text-white">
                    {selected.introduzione?.credits != null && (
                      <li><strong>CFU:</strong> {selected.introduzione.credits}</li>
                    )}
                    {selected.durata && <li><strong>Durata:</strong> {selected.durata}</li>}
                    {selected.livello && <li><strong>Livello:</strong> {selected.livello}</li>}
                    {selected.introduzione?.semester && (
                      <li><strong>Semestre:</strong> {selected.introduzione.semester}</li>
                    )}
                  </ul>
                  
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {(selected.tags || []).map(tag => (
                      <Badge key={tag} bg="secondary">{tag}</Badge>
                    ))}
                  </div>
                  
                  {/* Nota per il docente */}
                  <Form.Group className="mb-2">
                    <Form.Label className="text-white-75">Nota per il docente (opzionale)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Scrivi una breve richiesta o motivazione…"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </Form.Group>
                </>
              )}
            </Modal.Body>
            
            <Modal.Footer>
              {/* testo del bottone Annulla più leggibile sul glass */}
              <Button className="btn-glass-outline text-white" onClick={closeModal}>
                Annulla
              </Button>
              <Button
                className="btn-glass"
                onClick={() => { setSent(true); /* oppure sendRequest(); */ }}
                disabled={enrolledIds.has(selected?.id)}
                title={enrolledIds.has(selected?.id) ? 'Sei già iscritto a questo corso' : undefined}
              >
                {enrolledIds.has(selected?.id) ? 'Già iscritto' : 'Richiedi accesso'}
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="text-white">Richiesta inviata</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="mb-0 text-white-75">
                La tua richiesta è stata inviata ed è in attesa di approvazione.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-glass" onClick={closeModal}>Ok</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

    </div>
  );
}
