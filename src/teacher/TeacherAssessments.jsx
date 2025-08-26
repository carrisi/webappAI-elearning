import React, { useMemo, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge, Accordion } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import './Style/TeacherGeneralDashboard.css'; // hero/heading/buttons coerenti con dashboard
import './Style/TeacherCourses.css';          // .glass-card / .glass-hero
import './Style/TeacherAssessments.css';      // rifiniture (tabella/btn)
import dataMock from '../data/assessmentsMock';

export default function TeacherAssessments() {
  const { id: courseId } = useParams();

  // Stato: copio il mock in locale per CRUD in-memory
  const [esami, setEsami] = useState(dataMock.esami);
  const [esoneri, setEsoneri] = useState(dataMock.esoneri);
  const [esercitazioni, setEsercitazioni] = useState(dataMock.esercitazioni);

  // === Modale “Nuovo elemento” (Esame/Esonero/Esercitazione) ===
  const [showNewItem, setShowNewItem] = useState(false);
  const [newItem, setNewItem] = useState({
    sezione: 'esami',
    titolo: '',
    data: '',
    peso: 1.0,
  });

  const saveNewItem = (e) => {
    e.preventDefault();
    const payload = {
      id: `${newItem.sezione}-${Date.now()}`,
      titolo: newItem.titolo.trim() || 'Senza titolo',
      data: newItem.data || '',
      peso: Number(newItem.peso) || 1.0,
      valutazioni: [],
    };
    if (newItem.sezione === 'esami') setEsami(prev => [payload, ...prev]);
    else if (newItem.sezione === 'esoneri') setEsoneri(prev => [payload, ...prev]);
    else setEsercitazioni(prev => [payload, ...prev]);

    setShowNewItem(false);
    setNewItem({ sezione: 'esami', titolo: '', data: '', peso: 1.0 });
  };

  // === Modale “Nuova valutazione” (scegli sezione->elemento) ===
  const [showNewGrade, setShowNewGrade] = useState(false);
  const itemsBySection = useMemo(() => ({
    esami, esoneri, esercitazioni
  }), [esami, esoneri, esercitazioni]);

  const [grade, setGrade] = useState({
    sezione: 'esami',
    itemId: '',
    studente: '',
    matricola: '',
    voto: '',
    note: '',
  });

  const handleSectionChange = (sec) => {
    const firstId = itemsBySection[sec][0]?.id || '';
    setGrade(g => ({ ...g, sezione: sec, itemId: firstId }));
  };

  const saveGrade = (e) => {
    e.preventDefault();
    const { sezione, itemId, studente, matricola, voto, note } = grade;
    if (!itemId || !studente.trim() || !matricola.trim() || voto === '') return;

    const entry = { studente: studente.trim(), matricola: matricola.trim(), voto: Number(voto), note: (note || '').trim() };

    const up = (arr, setArr) => setArr(prev => prev.map(it => it.id === itemId ? { ...it, valutazioni: [entry, ...it.valutazioni] } : it));
    if (sezione === 'esami') up(esami, setEsami);
    else if (sezione === 'esoneri') up(esoneri, setEsoneri);
    else up(esercitazioni, setEsercitazioni);

    setShowNewGrade(false);
    setGrade(g => ({ ...g, studente: '', matricola: '', voto: '', note: '' }));
  };

  // Helpers
  const titleOf = (sec) => (sec === 'esami' ? 'Esami' : sec === 'esoneri' ? 'Esoneri' : 'Esercitazioni');
  const SectionCard = ({ title, children, action }) => (
    <Card className="glass-card h-100">
      <Card.Header className="d-flex align-items-center justify-content-between">
        <h5 className="mb-0">{title}</h5>
        {action}
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  );

  const SectionList = ({ items }) => (
    items.length === 0 ? (
      <p className="text-muted mb-0">Ancora nessun elemento.</p>
    ) : (
      <Accordion alwaysOpen>
        {items.map((it, idx) => (
          <Accordion.Item eventKey={String(idx)} key={it.id} className="mb-2 glass-subcard">
            <Accordion.Header>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-semibold">{it.titolo}</span>
                <Badge bg="light" text="dark">Valutazioni: {it.valutazioni.length}</Badge>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                <small className="text-muted">Data: {it.data || '—'} · Peso: {it.peso}</small>
              </div>
              {it.valutazioni.length === 0 ? (
                <p className="text-muted mb-0">Nessuna valutazione presente.</p>
              ) : (
                <Table size="sm" responsive className="glass-table mb-0">
                  <thead>
                    <tr>
                      <th>Studente</th>
                      <th>Matricola</th>
                      <th>Voto</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {it.valutazioni.map((v, i) => (
                      <tr key={i}>
                        <td>{v.studente}</td>
                        <td>{v.matricola}</td>
                        <td>{v.voto}</td>
                        <td>{v.note || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    )
  );

  return (
    <Container className="teacher-assessments py-4">
      {/* HEADER / HERO */}
      <section className="glass-hero text-white mb-4">
        <h1 className="hero-title mb-1">Valutazioni</h1>
        <p className="hero-subtitle mb-2">Gestisci esami, esoneri ed esercitazioni in un’unica pagina.</p>

        <div className="hero-actions d-flex justify-content-center flex-wrap gap-2 mt-3">
          <Button variant="light" className="landing-btn primary" onClick={() => {
            setShowNewItem(true);
            setNewItem({ sezione: 'esami', titolo: '', data: '', peso: 1.0 });
          }}>
            + Nuovo elemento
          </Button>

          <Button variant="light" className="landing-btn outline" onClick={() => {
            const firstId = itemsBySection['esami'][0]?.id || '';
            setGrade(g => ({ ...g, sezione: 'esami', itemId: firstId }));
            setShowNewGrade(true);
          }}>
            + Nuova valutazione
          </Button>

          <Link to={courseId ? `/docente/corsi/${courseId}/dashboard` : '/docente/dashboard'} className="landing-btn outline">
            Torna alla dashboard
          </Link>
        </div>
      </section>

      {/* SEZIONE: ESAMI */}
      <section className="mb-4" aria-labelledby="secEsami">
        <h2 id="secEsami" className="dash-heading">Esami</h2>
        <SectionCard
          title="Elenco Esami"
          action={<Badge bg="light" text="dark">{esami.length} attivi</Badge>}
        >
          <SectionList items={esami} />
        </SectionCard>
      </section>

      {/* SEZIONE: ESONERI */}
      <section className="mb-4" aria-labelledby="secEsoneri">
        <h2 id="secEsoneri" className="dash-heading">Esoneri</h2>
        <SectionCard
          title="Elenco Esoneri"
          action={<Badge bg="light" text="dark">{esoneri.length} attivi</Badge>}
        >
          <SectionList items={esoneri} />
        </SectionCard>
      </section>

      {/* SEZIONE: ESERCITAZIONI */}
      <section className="mb-5" aria-labelledby="secEsercitazioni">
        <h2 id="secEsercitazioni" className="dash-heading">Esercitazioni</h2>
        <SectionCard
          title="Elenco Esercitazioni"
          action={<Badge bg="light" text="dark">{esercitazioni.length} attive</Badge>}
        >
          <SectionList items={esercitazioni} />
        </SectionCard>
      </section>

      {/* MODALE: Nuovo elemento */}
      <Modal show={showNewItem} onHide={() => setShowNewItem(false)} centered>
        <Modal.Header closeButton className="glass-card text-black">
          <Modal.Title>Nuovo elemento</Modal.Title>
        </Modal.Header>
        <Modal.Body className="glass-card">
          <Form onSubmit={saveNewItem}>
            <Row className="g-3">
              <Col xs={12} md={4}>
                <Form.Label>Sezione</Form.Label>
                <Form.Select
                  value={newItem.sezione}
                  onChange={(e) => setNewItem(s => ({ ...s, sezione: e.target.value }))}
                >
                  <option value="esami">Esami</option>
                  <option value="esoneri">Esoneri</option>
                  <option value="esercitazioni">Esercitazioni</option>
                </Form.Select>
              </Col>
              <Col xs={12} md={8}>
                <Form.Label>Titolo</Form.Label>
                <Form.Control
                  placeholder="Es: Appello Luglio / Esonero 2 / Esercitazione 3"
                  value={newItem.titolo}
                  onChange={(e) => setNewItem(s => ({ ...s, titolo: e.target.value }))}
                />
              </Col>
              <Col xs={12} md={6}>
                <Form.Label>Data</Form.Label>
                <Form.Control
                  type="date"
                  value={newItem.data}
                  onChange={(e) => setNewItem(s => ({ ...s, data: e.target.value }))}
                />
              </Col>
              <Col xs={12} md={6}>
                <Form.Label>Peso</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  min="0"
                  value={newItem.peso}
                  onChange={(e) => setNewItem(s => ({ ...s, peso: e.target.value }))}
                />
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" onClick={() => setShowNewItem(false)}>Annulla</Button>
              <Button type="submit" variant="light" className="landing-btn primary">Salva</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* MODALE: Nuova valutazione */}
      <Modal show={showNewGrade} onHide={() => setShowNewGrade(false)} centered>
        <Modal.Header closeButton className="glass-card text-black">
          <Modal.Title>Nuova valutazione</Modal.Title>
        </Modal.Header>
        <Modal.Body className="glass-card">
          <Form onSubmit={saveGrade}>
            <Row className="g-3">
              <Col xs={12} md={4}>
                <Form.Label>Sezione</Form.Label>
                <Form.Select
                  value={grade.sezione}
                  onChange={(e) => handleSectionChange(e.target.value)}
                >
                  <option value="esami">Esami</option>
                  <option value="esoneri">Esoneri</option>
                  <option value="esercitazioni">Esercitazioni</option>
                </Form.Select>
              </Col>
              <Col xs={12} md={8}>
                <Form.Label>Elemento</Form.Label>
                <Form.Select
                  value={grade.itemId}
                  onChange={(e) => setGrade(g => ({ ...g, itemId: e.target.value }))}
                >
                  {itemsBySection[grade.sezione].map(it => (
                    <option key={it.id} value={it.id}>
                      {it.titolo} {it.data ? `— ${it.data}` : ''}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col xs={12} md={6}>
                <Form.Label>Studente</Form.Label>
                <Form.Control
                  placeholder="Nome e cognome"
                  value={grade.studente}
                  onChange={(e) => setGrade(g => ({ ...g, studente: e.target.value }))}
                />
              </Col>
              <Col xs={6} md={3}>
                <Form.Label>Matricola</Form.Label>
                <Form.Control
                  placeholder="Matricola"
                  value={grade.matricola}
                  onChange={(e) => setGrade(g => ({ ...g, matricola: e.target.value }))}
                />
              </Col>
              <Col xs={6} md={3}>
                <Form.Label>Voto</Form.Label>
                <Form.Control
                  type="number"
                  min="0" max="31" step="1"
                  value={grade.voto}
                  onChange={(e) => setGrade(g => ({ ...g, voto: e.target.value }))}
                />
              </Col>

              <Col xs={12}>
                <Form.Label>Note</Form.Label>
                <Form.Control
                  placeholder="Opzionale"
                  value={grade.note}
                  onChange={(e) => setGrade(g => ({ ...g, note: e.target.value }))}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="light"className='landing-btn primary' onClick={() => setShowNewGrade(false)}>Annulla</Button>
              <Button type="submit" variant="light" className="landing-btn primary">Salva</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
