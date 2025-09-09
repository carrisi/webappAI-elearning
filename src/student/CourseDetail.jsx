// src/pages/CourseDetail.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, Tab, Accordion, ListGroup, Button } from 'react-bootstrap';
import './Style/CourseDetail.css';

import { db } from '../firebase';
import {
  doc, getDoc, collection, getDocs,
  query, orderBy
} from 'firebase/firestore';

export default function CourseDetail() {
  const { id } = useParams();

  const [corso, setCorso] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false); // MOSTRA ALTRO/MENO

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // 1) Documento corso
        const courseRef = doc(db, 'courses', id);
        const courseSnap = await getDoc(courseRef);
        if (!courseSnap.exists()) {
          if (alive) { setCorso(null); setLoaded(true); }
          return;
        }
        const d = courseSnap.data() || {};
        const intro = d.introduzione || {};

        const base = {
          id: courseSnap.id,
          titolo: d.titolo || 'Corso senza titolo',
          descrizione: d.descrizione || '',
          introduzione: {
            academicYear: intro.academicYear || d.academicYear || '',
            professor: intro.professor || d.professor || '',
            degree: intro.degree || d.degree || '',
            semester: intro.semester || d.semester || '',
            credits: intro.credits ?? d.credits ?? '',
            notes: intro.notes || d.notes || '',
            officeHoursTitle: intro.officeHoursTitle || d.officeHoursTitle || '',
            officeHours: intro.officeHours || d.officeHours || '',
          },
          sections: [],
        };

        // 2) Sezioni
        const secsSnap = await getDocs(collection(db, 'courses', id, 'sections'));
        const sections = await Promise.all(
          secsSnap.docs.map(async (sdoc) => {
            const sdata = sdoc.data() || {};

            // 3) Lezioni della sezione (ordinate dalla più vecchia alla più recente)
            //    - se tutte hanno createdAt: l'ordine è deciso da Firestore
            //    - se qualcuna non ce l'ha, facciamo un ordinamento di fallback
            let lessonsSnap;
            try {
              const lesQ = query(
                collection(db, 'courses', id, 'sections', sdoc.id, 'lessons'),
                orderBy('createdAt', 'asc')
              );
              lessonsSnap = await getDocs(lesQ);
            } catch {
              // Fallback se manca l'indice o i dati sono eterogenei
              lessonsSnap = await getDocs(collection(db, 'courses', id, 'sections', sdoc.id, 'lessons'));
            }

            const lessons = lessonsSnap.docs.map((ldoc) => {
              const ldata = ldoc.data() || {};
              const fileTypes = Array.isArray(ldata.fileTypes)
                ? ldata.fileTypes
                : (ldata.fileType ? [ldata.fileType] : []);
              const createdAtMs = ldata?.createdAt?.toMillis
                ? ldata.createdAt.toMillis()
                : (typeof ldata?.createdAt?.seconds === 'number'
                    ? ldata.createdAt.seconds * 1000
                    : null);
              return {
                id: ldoc.id,
                title: ldata.title || ldata.nome || 'Lezione',
                fileTypes,
                order: Number.isFinite(ldata.order) ? Number(ldata.order) : undefined,
                createdAtMs,
              };
            });

            // Fallback: se qualche lezione non ha createdAt, garantiamo comunque stabilità
            lessons.sort((a, b) => {
              const aHas = Number.isFinite(a.createdAtMs);
              const bHas = Number.isFinite(b.createdAtMs);
              if (aHas || bHas) {
                // più vecchia → più piccola → prima
                return (a.createdAtMs || 0) - (b.createdAtMs || 0);
              }
              // poi per 'order' crescente (se presente)
              const ao = Number.isFinite(a.order) ? a.order : Number.POSITIVE_INFINITY;
              const bo = Number.isFinite(b.order) ? b.order : Number.POSITIVE_INFINITY;
              if (ao !== bo) return ao - bo;
              // infine alfabetico sul titolo
              return (a.title || '').localeCompare(b.title || '', 'it', { sensitivity: 'base' });
            });

            return {
              id: sdoc.id,
              title: sdata.title || sdata.name || 'Sezione',
              order: Number.isFinite(sdata.order) ? Number(sdata.order) : undefined,
              lessons,
            };
          })
        );

        // Ordino sezioni per "order" se presente, altrimenti per titolo
        sections.sort((a, b) => {
          const ao = Number.isFinite(a.order) ? a.order : Number.POSITIVE_INFINITY;
          const bo = Number.isFinite(b.order) ? b.order : Number.POSITIVE_INFINITY;
          if (ao !== bo) return ao - bo;
          return (a.title || '').localeCompare(b.title || '', 'it', { sensitivity: 'base' });
        });

        if (alive) setCorso({ ...base, sections });
      } catch (e) {
        console.error('CourseDetail load error', e);
        if (alive) setCorso(null);
      } finally {
        if (alive) setLoaded(true);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  // Mantengo la stessa logica di rendering: mostro "non trovato" solo dopo il load
  const defaultActiveKeys = useMemo(
    () => (corso?.sections || []).map(s => String(s.id)),
    [corso?.sections]
  );

  return (
    <div className="course-detail-page">
      {!loaded ? null : !corso ? (
        <div className="cd-not-found">
          <h3>Corso non trovato</h3>
        </div>
      ) : (
        <>
          <h2 className="cd-title">{corso.titolo}</h2>

          <div className="glass-nav-container glass-nav">
            <Tabs defaultActiveKey="corso" id="course-detail-tabs" className="cd-tabs">
              <Tab eventKey="corso" title="Corso">
                <div className="glass-intro-container mb-4">
                  <div className="intro-year">{corso.introduzione.academicYear}</div>
                  <h5 className="intro-professor">{corso.introduzione.professor}</h5>
                  <div className="intro-degree">
                    {corso.introduzione.degree} – {corso.introduzione.semester}, {corso.introduzione.credits} CFU
                  </div>
                  <hr />
                  <div className="intro-notes">{corso.introduzione.notes}</div>
                  <h6 className="intro-office-title">{corso.introduzione.officeHoursTitle}</h6>
                  <div className="intro-office">{corso.introduzione.officeHours}</div>
                  <hr />
                  <h5>Obiettivi del corso</h5>

                  {/* DESCRIZIONE con mostra altro/meno */}
                  <p className={`course-description ${expanded ? 'expanded' : 'collapsed'}`}>
                    {corso.descrizione}
                  </p>
                  {corso.descrizione && corso.descrizione.length > 0 && (
                    <Button
                      variant="link"
                      className="toggle-description"
                      onClick={() => setExpanded(!expanded)}
                    >
                      {expanded ? 'Mostra meno' : 'Mostra altro'}
                    </Button>
                  )}
                </div>

                <Accordion
                  alwaysOpen
                  defaultActiveKey={defaultActiveKeys}
                  className="cd-accordion"
                >
                  {(corso.sections || []).map(sec => (
                    <Accordion.Item eventKey={String(sec.id)} key={sec.id}>
                      <Accordion.Header>{sec.title}</Accordion.Header>
                      <Accordion.Body>
                        <ListGroup variant="flush">
                          {(sec.lessons || []).map(lez => (
                            <ListGroup.Item
                              key={lez.id}
                              action
                              as={Link}
                              to={`/studente/corsi/${corso.id}/sezioni/${sec.id}/lezioni/${lez.id}`}
                              className="glass-card clickable-card mb-2 d-flex justify-content-between align-items-center"
                            >
                              <div>
                                <span>{lez.title}</span>{' '}
                                <small className="text-muted ms-3">[{(lez.fileTypes || []).join(', ')}]</small>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Tab>

              <Tab eventKey="valutazioni" title="Valutazioni">
                <p>Qui compariranno i voti e i feedback del corso.</p>
              </Tab>

              <Tab eventKey="altro" title="Altro">
                <p>Altre risorse, Q&amp;A, materiali scaricabili…</p>
              </Tab>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
}
