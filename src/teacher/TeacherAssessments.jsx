// src/teacher/pages/TeacherAssessments.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge, Accordion, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './Style/TeacherGeneralDashboard.css';
import './Style/TeacherCourses.css';
import './Style/TeacherAssessments.css';

import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  doc, collection, getDocs, serverTimestamp, query, orderBy, where,
  setDoc, deleteDoc, writeBatch
} from 'firebase/firestore';

function SectionCard({ title, action, children }) {
  return (
    <Card className="glass-card h-100">
      <Card.Header className="d-flex align-items-center justify-content-between">
        <h5 className="mb-0">{title}</h5>
        {action ?? null}
      </Card.Header>
      <Card.Body className="pt-3">{children}</Card.Body>
    </Card>
  );
}

/** Modal “flat”: niente header/body/footer separati; glass SOLO attorno */
function SimpleModal({ show, onHide, title, children, actions, size="lg" }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size={size}
      dialogClassName="glass-wrap-modal"          // glass attorno
      contentClassName="modal-surface"           // superficie interna neutra
      backdropClassName="soft-backdrop"          // backdrop meno invasivo
    >
      <div className="modal-surface-inner">
        <div className="modal-row-top">
          <div className="modal-title">{title}</div>
          <button className="modal-close-btn" aria-label="Chiudi" onClick={onHide}>✕</button>
        </div>

        <div className="modal-content-flat">
          {children}
        </div>

        {actions && (
          <div className="modal-actions">
            {actions}
          </div>
        )}
      </div>
    </Modal>
  );
}

/** Dialog conferma: stesso stile “flat” */
function ConfirmDialog({ show, onCancel, onConfirm, title, message, loading=false, confirmLabel="Elimina definitivamente" }) {
  return (
    <SimpleModal
      show={show}
      onHide={onCancel}
      title={title}
      size="md"
      actions={
        <>
          <Button variant="light" className="landing-btn primary" onClick={onCancel} disabled={loading}>
            Annulla
          </Button>
          <Button variant="light" className="landing-btn primary danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Elimino…' : confirmLabel}
          </Button>
        </>
      }
    >
      <p className="m-0">{message}</p>
    </SimpleModal>
  );
}

// ---- helper anti-duplicati ----
const uniqById = (arr) => {
  const map = new Map();
  for (const x of arr || []) map.set(x.id, x);
  return Array.from(map.values());
};

export default function TeacherAssessments() {
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [courses, setCourses] = useState([]);
  const [courseFilter, setCourseFilter] = useState('all');
  const [itemsByCourse, setItemsByCourse] = useState({});
  const [esami, setEsami] = useState([]);
  const [esoneri, setEsoneri] = useState([]);
  const [esercitazioni, setEsercitazioni] = useState([]);

  const [isSavingItem, setIsSavingItem] = useState(false);
  const [isSavingGrade, setIsSavingGrade] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [confirm, setConfirm] = useState({ show:false, type:null, payload:null });

  const normalizeSection = (s) => (['esami','esoneri','esercitazioni'].includes(s) ? s : 'esami');
  const courseTitle = (cid) => courses.find(c => c.id === cid)?.titolo || 'Corso';
  const countValutazioni = (items) => items.reduce((acc, it) => acc + (it.valutazioni?.length || 0), 0);

  const makeViewFromMap = (cid) => {
    const attachCourse = (arr, id) => (arr || []).map(it => ({ ...it, courseId: id, courseTitle: courseTitle(id) }));
    if (cid === 'all') {
      const allEsami   = Object.entries(itemsByCourse).flatMap(([id, grp]) => attachCourse(grp.esami, id));
      const allEsoneri = Object.entries(itemsByCourse).flatMap(([id, grp]) => attachCourse(grp.esoneri, id));
      const allEserc   = Object.entries(itemsByCourse).flatMap(([id, grp]) => attachCourse(grp.esercitazioni, id));
      setEsami(allEsami); setEsoneri(allEsoneri); setEsercitazioni(allEserc);
    } else {
      const g = itemsByCourse[cid] || { esami:[], esoneri:[], esercitazioni:[] };
      setEsami((g.esami || []).map(it => ({ ...it, courseId: cid, courseTitle: courseTitle(cid) })));
      setEsoneri((g.esoneri || []).map(it => ({ ...it, courseId: cid, courseTitle: courseTitle(cid) })));
      setEsercitazioni((g.esercitazioni || []).map(it => ({ ...it, courseId: cid, courseTitle: courseTitle(cid) })));
    }
  };
  useEffect(() => { makeViewFromMap(courseFilter); /* eslint-disable-next-line */ }, [courseFilter, itemsByCourse, courses]);

  useEffect(() => {
    let alive = true;
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!alive) return;
      if (!user) { setErr('Devi effettuare l’accesso.'); setLoading(false); return; }
      try {
        setErr(null); setStatsLoading(true);
        const q = query(collection(db, 'courses'), where('ownerId','==',user.uid), orderBy('createdAt','desc'));
        const cSnap = await getDocs(q);
        const myCourses = cSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setCourses(myCourses);

        const tmp = {};
        await Promise.all(myCourses.map(async (c) => {
          const assessRef = collection(db,'courses',c.id,'assessments');
          const assessSnap = await getDocs(query(assessRef, orderBy('createdAt','desc')));
          const group = { esami:[], esoneri:[], esercitazioni:[] };

          await Promise.all(assessSnap.docs.map(async (adoc) => {
            const a = { id: adoc.id, ...adoc.data() };
            const sec = normalizeSection(a.type || a.sezione);
            const gradesRef = collection(db,'courses',c.id,'assessments',adoc.id,'grades');
            const gradesSnap = await getDocs(query(gradesRef, orderBy('createdAt','desc')));
            const valutazioni = gradesSnap.docs.map(gd => ({ id: gd.id, ...gd.data() }));
            group[sec].push({ id:a.id, titolo:a.titolo||'Senza titolo', data:a.data||'', peso:a.peso??1.0, valutazioni:uniqById(valutazioni) });
          }));

          group.esami = uniqById(group.esami);
          group.esoneri = uniqById(group.esoneri);
          group.esercitazioni = uniqById(group.esercitazioni);
          tmp[c.id] = group;
        }));

        if (!alive) return;
        setItemsByCourse(tmp);
        setCourseFilter(myCourses.length === 1 ? myCourses[0].id : 'all');
      } catch(e) {
        console.error(e); setErr('Impossibile caricare corsi o valutazioni.');
      } finally {
        if (!alive) return; setLoading(false); setStatsLoading(false);
      }
    });
    return () => { alive = false; unsub && unsub(); };
  }, []);

  const SectionList = ({ items, section }) =>
    items.length === 0 ? (
      <p className="text-muted mb-0">Ancora nessun elemento.</p>
    ) : (
      <Accordion alwaysOpen>
        {items.map((it, idx) => (
          <Accordion.Item eventKey={String(idx)} key={`${it.courseId}-${it.id}`} className="mb-2 glass-subcard">
            <Accordion.Header>
              <div className="d-flex align-items-center gap-2">
                <Badge bg="light" text="dark">{it.courseTitle}</Badge>
                <span className="fw-semibold">{it.titolo}</span>
                <Badge bg="light" text="dark">Valutazioni: {it.valutazioni.length}</Badge>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                <small className="text-muted">Data: {it.data || '—'} · Peso: {it.peso}</small>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-danger" size="sm"
                    disabled={deletingId === `assess:${it.id}`}
                    onClick={() => setConfirm({ show:true, type:"assessment", payload:{ cid:it.courseId, sezione:section, assessId:it.id } })}
                  >
                    {deletingId === `assess:${it.id}` ? 'Elimino…' : 'Elimina elemento'}
                  </Button>
                </div>
              </div>

              {it.valutazioni.length === 0 ? (
                <p className="text-muted mb-0">Nessuna valutazione presente.</p>
              ) : (
                <Table size="sm" responsive className="glass-table mb-0">
                  <thead>
                    <tr><th>Studente</th><th>Matricola</th><th>Voto</th><th>Note</th><th style={{width:1}}></th></tr>
                  </thead>
                  <tbody>
                    {it.valutazioni.map((v) => (
                      <tr key={v.id}>
                        <td>{v.studente}</td><td>{v.matricola}</td><td>{v.voto}</td><td>{v.note || '—'}</td>
                        <td className="text-end">
                          <Button
                            variant="outline-danger" size="sm"
                            disabled={deletingId === `grade:${v.id}`}
                            onClick={() => setConfirm({ show:true, type:"grade", payload:{ cid:it.courseId, sezione:section, assessId:it.id, gradeId:v.id } })}
                            aria-label="Elimina valutazione" title="Elimina valutazione"
                          >✕</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    );

  // Modali: stato + open
  const [showNewItem, setShowNewItem] = useState(false);
  const [newItem, setNewItem] = useState({ courseId:'', sezione:'esami', titolo:'', data:'', peso:1.0 });
  const [showNewGrade, setShowNewGrade] = useState(false);
  const [grade, setGrade] = useState({ courseId:'', sezione:'esami', itemId:'', studente:'', matricola:'', voto:'', note:'' });

  const openNewItem = () => {
    const defaultCourseId = courseFilter !== 'all' ? courseFilter : (courses[0]?.id || '');
    setNewItem({ courseId: defaultCourseId, sezione:'esami', titolo:'', data:'', peso:1.0 });
    setShowNewItem(true);
  };
  const openNewGrade = () => {
    let cid = courseFilter !== 'all' ? courseFilter : '';
    if (!cid) {
      cid = courses.find(c => {
        const g = itemsByCourse[c.id] || {};
        return (g.esami?.length || g.esoneri?.length || g.esercitazioni?.length);
      })?.id || courses[0]?.id || '';
    }
    let sec = 'esami';
    const grp = itemsByCourse[cid] || { esami:[], esoneri:[], esercitazioni:[] };
    if (grp.esami.length === 0 && grp.esoneri.length > 0) sec = 'esoneri';
    if (grp.esami.length === 0 && grp.esoneri.length === 0 && grp.esercitazioni.length > 0) sec = 'esercitazioni';
    const firstId = (itemsByCourse[cid]?.[sec]?.[0]?.id) || '';
    setGrade({ courseId: cid, sezione: sec, itemId:firstId, studente:'', matricola:'', voto:'', note:'' });
    setShowNewGrade(true);
  };
  const onChangeGradeCourse = (cid) => {
    const sec = grade.sezione;
    const firstId = (itemsByCourse[cid]?.[sec]?.[0]?.id) || '';
    setGrade(g => ({ ...g, courseId: cid, itemId:firstId }));
  };
  const onChangeGradeSection = (sec) => {
    const firstId = (itemsByCourse[grade.courseId]?.[sec]?.[0]?.id) || '';
    setGrade(g => ({ ...g, sezione: sec, itemId:firstId }));
  };

  // Salvataggi
  const saveNewItem = async (e) => {
    e.preventDefault(); if (isSavingItem) return;
    try {
      setIsSavingItem(true); setErr(null);
      const cid = newItem.courseId; if (!cid) throw new Error('Seleziona un corso');
      const sec = normalizeSection(newItem.sezione);
      const payload = {
        type: sec, titolo:(newItem.titolo||'').trim()||'Senza titolo',
        data:newItem.data||'', peso:Number(newItem.peso)||1.0,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      };
      const uid = auth.currentUser?.uid || 'anon';
      const newId = `${uid}-${Date.now()}`;
      await setDoc(doc(db,'courses',cid,'assessments',newId), payload);

      const item = { id:newId, titolo:payload.titolo, data:payload.data, peso:payload.peso, valutazioni:[] };
      setItemsByCourse(prev => {
        const next = {...prev}; const grp = next[cid] || { esami:[], esoneri:[], esercitazioni:[] };
        grp[sec] = uniqById([item, ...(grp[sec]||[])]); next[cid] = grp; return next;
      });
      setShowNewItem(false);
    } catch(e){ console.error(e); setErr('Errore nella creazione dell’elemento.'); }
    finally { setIsSavingItem(false); }
  };

  const saveGrade = async (e) => {
    e.preventDefault(); if (isSavingGrade) return;
    try {
      setIsSavingGrade(true); setErr(null);
      const { courseId:cid, sezione, itemId } = grade;
      if (!cid) throw new Error('Seleziona un corso');
      if (!itemId) throw new Error('Seleziona un elemento');
      const entry = {
        studente:(grade.studente||'').trim(), matricola:(grade.matricola||'').trim(),
        voto:Number(grade.voto), note:(grade.note||'').trim(), createdAt: serverTimestamp(),
      };
      const uid = auth.currentUser?.uid || 'anon';
      const gid = `${uid}-${Date.now()}`;
      await setDoc(doc(db,'courses',cid,'assessments',String(itemId),'grades',gid), entry);

      setItemsByCourse(prev => {
        const next = {...prev};
        const arr = (next[cid]?.[sezione]||[]).map(it =>
          it.id === itemId ? { ...it, valutazioni: uniqById([{ ...entry, id:gid, createdAt:new Date() }, ...(it.valutazioni||[])]) } : it
        );
        next[cid] = { ...(next[cid]||{}), [sezione]: arr }; return next;
      });
      setShowNewGrade(false);
      setGrade(g => ({ ...g, studente:'', matricola:'', voto:'', note:'' }));
    } catch(e){ console.error(e); setErr('Errore nel salvataggio della valutazione.'); }
    finally { setIsSavingGrade(false); }
  };

  // Delete (senza window.confirm)
  const handleDeleteAssessment = async (cid, sezione, assessId) => {
    try {
      setDeletingId(`assess:${assessId}`);
      const snap = await getDocs(collection(db,'courses',cid,'assessments',assessId,'grades'));
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(doc(db,'courses',cid,'assessments',assessId,'grades',d.id)));
      batch.delete(doc(db,'courses',cid,'assessments',assessId));
      await batch.commit();
      setItemsByCourse(prev => {
        const next = {...prev};
        next[cid] = { ...(next[cid]||{}), [sezione]: (next[cid]?.[sezione]||[]).filter(it => it.id !== assessId) };
        return next;
      });
    } catch(e){ console.error(e); setErr('Errore nella cancellazione dell’elemento.'); }
    finally { setDeletingId(null); }
  };
  const handleDeleteGrade = async (cid, sezione, assessId, gradeId) => {
    try {
      setDeletingId(`grade:${gradeId}`);
      await deleteDoc(doc(db,'courses',cid,'assessments',assessId,'grades',gradeId));
      setItemsByCourse(prev => {
        const next = {...prev};
        next[cid] = {
          ...(next[cid]||{}),
          [sezione]: (next[cid]?.[sezione]||[]).map(it => it.id === assessId ? { ...it, valutazioni:(it.valutazioni||[]).filter(v => v.id !== gradeId) } : it)
        };
        return next;
      });
    } catch(e){ console.error(e); setErr('Errore nella cancellazione della valutazione.'); }
    finally { setDeletingId(null); }
  };
  const onConfirmDelete = async () => {
    if (!confirm.show || !confirm.payload) return;
    const p = confirm.payload;
    if (confirm.type === 'assessment') await handleDeleteAssessment(p.cid, p.sezione, p.assessId);
    else await handleDeleteGrade(p.cid, p.sezione, p.assessId, p.gradeId);
    setConfirm({ show:false, type:null, payload:null });
  };

  if (loading) {
    return (
      <Container className="teacher-assessments py-4">
        <Spinner animation="border" size="sm" className="me-2" />
        <span>Caricamento…</span>
      </Container>
    );
  }

  const esamiCount = esami.length, esoneriCount = esoneri.length, esercCount = esercitazioni.length;
  const esamiVal = countValutazioni(esami), esoneriVal = countValutazioni(esoneri), esercVal = countValutazioni(esercitazioni);

  return (
    <Container className="teacher-assessments py-4">
      {/* HERO */}
      <section className="glass-hero text-white mb-3">
        <h1 className="hero-title mb-1">Valutazioni</h1>
        <p className="hero-subtitle mb-2">Gestisci esami, esoneri ed esercitazioni su tutti i tuoi corsi.</p>

        <div className="d-flex flex-wrap gap-2 mt-2 justify-content-center">
          <Button variant="light" className="landing-btn primary" onClick={openNewItem}>+ Nuovo elemento</Button>
          <Button variant="light" className="landing-btn outline" onClick={openNewGrade}>+ Nuova valutazione</Button>
        </div>
      </section>

      {/* FILTRO */}
      <div className="filter-under-hero d-flex align-items-center flex-wrap justify-content-center gap-2 mb-3">
        <label htmlFor="courseFilter" className="hero-subtitle m-0">Filtra per corso:</label>
        <div className={`btn-select-wrap landing-btn ${courseFilter === 'all' ? 'outline' : 'primary'} w-auto`}>
          <Form.Select id="courseFilter" className="btn-select form-select" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} aria-label="Filtro corso">
            <option value="all">Tutti i corsi</option>
            {courses.map(c => (<option key={c.id} value={c.id}>{c.titolo || '(Senza titolo)'}</option>))}
          </Form.Select>
        </div>
      </div>

      {!!err && <Alert variant="danger" className="glass-card">{err}</Alert>}

      <Row className="g-3">
        <Col xs={12} lg={4}>
          <Card className="glass-card h-100 sticky-lg-top sidebar-card">
            <Card.Body>
              <h5 className="mb-3">Riepilogo <br/> {courseFilter==='all' ? '' : ` ${courseTitle(courseFilter)}`}</h5>
              <div className="d-grid gap-2 mb-3">
                <div className="d-flex justify-content-between align-items-center"><span>Esami</span><Badge bg="light" text="dark">{esamiCount} • Val: {esamiVal}</Badge></div>
                <div className="d-flex justify-content-between align-items-center"><span>Esoneri</span><Badge bg="light" text="dark">{esoneriCount} • Val: {esoneriVal}</Badge></div>
                <div className="d-flex justify-content-between align-items-center"><span>Esercitazioni</span><Badge bg="light" text="dark">{esercCount} • Val: {esercVal}</Badge></div>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <Button as={Link} to="/docente/dashboard" variant="light" className="landing-btn outline w-100">Visualizza i tuoi corsi</Button>
                <Button as={Link} to="/docente/dashboard" variant="light" className="landing-btn primary w-100">Torna alla dashboard</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={8}>
          <section className="mb-4" aria-labelledby="secEsami">
            <h2 id="secEsami" className="dash-heading">Esami</h2>
            <SectionCard title="Elenco Esami" action={<Badge bg="light" text="dark">{esami.length} elementi</Badge>}>
              {statsLoading ? <div className="text-white-50">Caricamento…</div> : <SectionList section="esami" items={esami} />}
            </SectionCard>
          </section>

          <section className="mb-4" aria-labelledby="secEsoneri">
            <h2 id="secEsoneri" className="dash-heading">Esoneri</h2>
            <SectionCard title="Elenco Esoneri" action={<Badge bg="light" text="dark">{esoneri.length} elementi</Badge>}>
              {statsLoading ? <div className="text-white-50">Caricamento…</div> : <SectionList section="esoneri" items={esoneri} />}
            </SectionCard>
          </section>

          <section className="mb-5" aria-labelledby="secEsercitazioni">
            <h2 id="secEsercitazioni" className="dash-heading">Esercitazioni</h2>
            <SectionCard title="Elenco Esercitazioni" action={<Badge bg="light" text="dark">{esercitazioni.length} elementi</Badge>}>
              {statsLoading ? <div className="text-white-50">Caricamento…</div> : <SectionList section="esercitazioni" items={esercitazioni} />}
            </SectionCard>
          </section>
        </Col>
      </Row>

      {/* MODALE: Nuovo elemento (flat) */}
      <SimpleModal
        show={showNewItem}
        onHide={() => setShowNewItem(false)}
        title="Nuovo elemento"
        actions={
          <>
            <Button variant="light" className="landing-btn primary" onClick={() => setShowNewItem(false)}>Annulla</Button>
            <Button type="submit" form="form-new-item" variant="light" className="landing-btn primary" disabled={isSavingItem}>
              {isSavingItem ? 'Salvo…' : 'Salva'}
            </Button>
          </>
        }
      >
        <Form id="form-new-item" onSubmit={saveNewItem}>
          <Row className="g-3">
            <Col xs={12} md={5}>
              <Form.Label>Corso</Form.Label>
              <Form.Select value={newItem.courseId} onChange={(e)=>setNewItem(s=>({...s, courseId:e.target.value}))} required>
                <option value="">Seleziona corso…</option>
                {courses.map(c => (<option key={c.id} value={c.id}>{c.titolo || '(Senza titolo)'}</option>))}
              </Form.Select>
            </Col>
            <Col xs={12} md={4}>
              <Form.Label>Sezione</Form.Label>
              <Form.Select value={newItem.sezione} onChange={(e)=>setNewItem(s=>({...s, sezione:e.target.value}))}>
                <option value="esami">Esami</option>
                <option value="esoneri">Esoneri</option>
                <option value="esercitazioni">Esercitazioni</option>
              </Form.Select>
            </Col>
            <Col xs={12} md={3}>
              <Form.Label>Peso</Form.Label>
              <Form.Control type="number" step="0.1" min="0" value={newItem.peso} onChange={(e)=>setNewItem(s=>({...s, peso:e.target.value}))}/>
            </Col>
            <Col xs={12} md={8}>
              <Form.Label>Titolo</Form.Label>
              <Form.Control placeholder="Es: Appello Luglio / Esonero 2 / Esercitazione 3" value={newItem.titolo} onChange={(e)=>setNewItem(s=>({...s, titolo:e.target.value}))}/>
            </Col>
            <Col xs={12} md={4}>
              <Form.Label>Data</Form.Label>
              <Form.Control type="date" value={newItem.data} onChange={(e)=>setNewItem(s=>({...s, data:e.target.value}))}/>
            </Col>
          </Row>
        </Form>
      </SimpleModal>

      {/* MODALE: Nuova valutazione (flat) */}
      <SimpleModal
        show={showNewGrade}
        onHide={() => setShowNewGrade(false)}
        title="Nuova valutazione"
        actions={
          <>
            <Button variant="light" className="landing-btn primary" onClick={() => setShowNewGrade(false)}>Annulla</Button>
            <Button type="submit" form="form-new-grade" variant="light" className="landing-btn primary" disabled={isSavingGrade}>
              {isSavingGrade ? 'Salvo…' : 'Salva'}
            </Button>
          </>
        }
      >
        <Form id="form-new-grade" onSubmit={saveGrade}>
          <Row className="g-3">
            <Col xs={12} md={5}>
              <Form.Label>Corso</Form.Label>
              <Form.Select value={grade.courseId} onChange={(e)=>onChangeGradeCourse(e.target.value)} required>
                <option value="">Seleziona corso…</option>
                {courses.map(c => (<option key={c.id} value={c.id}>{c.titolo || '(Senza titolo)'}</option>))}
              </Form.Select>
            </Col>
            <Col xs={12} md={4}>
              <Form.Label>Sezione</Form.Label>
              <Form.Select value={grade.sezione} onChange={(e)=>onChangeGradeSection(e.target.value)}>
                <option value="esami">Esami</option>
                <option value="esoneri">Esoneri</option>
                <option value="esercitazioni">Esercitazioni</option>
              </Form.Select>
            </Col>
            <Col xs={12} md={3}>
              <Form.Label>Elemento</Form.Label>
              <Form.Select value={grade.itemId} onChange={(e)=>setGrade(g=>({...g, itemId:e.target.value}))}>
                {(itemsByCourse[grade.courseId]?.[grade.sezione] || []).length === 0
                  ? <option value="">— Nessun elemento —</option>
                  : (itemsByCourse[grade.courseId][grade.sezione]).map(it => (
                      <option key={it.id} value={it.id}>{it.titolo} {it.data ? `— ${it.data}` : ''}</option>
                    ))
                }
              </Form.Select>
            </Col>
            <Col xs={12} md={6}>
              <Form.Label>Studente</Form.Label>
              <Form.Control placeholder="Nome e cognome" value={grade.studente} onChange={(e)=>setGrade(g=>({...g, studente:e.target.value}))} required/>
            </Col>
            <Col xs={6} md={3}>
              <Form.Label>Matricola</Form.Label>
              <Form.Control placeholder="Matricola" value={grade.matricola} onChange={(e)=>setGrade(g=>({...g, matricola:e.target.value}))} required/>
            </Col>
            <Col xs={6} md={3}>
              <Form.Label>Voto</Form.Label>
              <Form.Control type="number" min="0" max="31" step="1" value={grade.voto} onChange={(e)=>setGrade(g=>({...g, voto:e.target.value}))} required/>
            </Col>
            <Col xs={12}>
              <Form.Label>Note</Form.Label>
              <Form.Control placeholder="Opzionale" value={grade.note} onChange={(e)=>setGrade(g=>({...g, note:e.target.value}))}/>
            </Col>
          </Row>
        </Form>
      </SimpleModal>

      {/* MODALE: Conferma eliminazione (flat) */}
      <ConfirmDialog
        show={confirm.show}
        title={confirm.type === "assessment" ? "Elimina elemento" : "Elimina valutazione"}
        message={confirm.type === "assessment"
          ? "Questa azione eliminerà definitivamente l’elemento e tutte le valutazioni collegate. Procedere?"
          : "Questa azione eliminerà definitivamente la valutazione selezionata. Procedere?"}
        onCancel={() => setConfirm({ show:false, type:null, payload:null })}
        onConfirm={onConfirmDelete}
        loading={Boolean(deletingId)}
        confirmLabel="Elimina definitivamente"
      />
    </Container>
  );
}
