import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Button, Form, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Style/TeacherCourseNew.css';
import { getAuth } from 'firebase/auth';

import { createCourseWithInitialSectionAndLesson } from "../services/courses";

export default function TeacherCourseNew() {
  const navigate = useNavigate();
  const auth = getAuth();
  const formRef = useRef(null);

  // 1) Titolo & Sottotitolo (sottotitolo = spiegazione generale)
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState(''); // ex "Descrizione/Obiettivi"

  // 2) Informazioni generali
  const [academicYear, setAcademicYear] = useState('');   // es. 2024/2025
  const [prof, setProf] = useState('');                   // autofill + bloccato
  const [degree, setDegree] = useState('');
  const [semester, setSemester] = useState('');           // "1° semestre" | "2° semestre"
  const [credits, setCredits] = useState('');             // CFU

  const [notes, setNotes] = useState('');
  const [officeHoursTitle, setOfficeHoursTitle] = useState('');
  const [officeHours, setOfficeHours] = useState('');

  // 3) Sezione iniziale + Lezione iniziale (stessi input della pagina di lezione)
  const [sectionTitle, setSectionTitle] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [hasVideo, setHasVideo] = useState(false);
  const [hasPdf, setHasPdf] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');

  const currentTypes = useMemo(
    () => [...(hasVideo ? ['video'] : []), ...(hasPdf ? ['pdf'] : [])],
    [hasVideo, hasPdf]
  );

  // ===== Autofill docente e blocco modifica =====
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const fallbackFromEmail = user.email ? user.email.split('@')[0] : 'Docente';
    const displayName = (user.displayName && user.displayName.trim()) || fallbackFromEmail;
    setProf(displayName);
  }, [auth]);

  // ===== Validazioni custom =====
  const isValidAcademicYear = (value) => {
    // Deve rispettare YYYY/YYYY e il secondo = primo + 1
    const m = /^(\d{4})\/(\d{4})$/.exec(value);
    if (!m) return false;
    const y1 = parseInt(m[1], 10);
    const y2 = parseInt(m[2], 10);
    return y2 === y1 + 1;
  };

  const isValidSemester = (value) => {
    return value === '1° semestre' || value === '2° semestre';
  };

  const isValidCredits = (value) => {
    if (value === '' || value === null) return false;
    const n = Number(value);
    return Number.isInteger(n) && n >= 1 && n <= 31;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) Fa scattare la validazione HTML5 (required/pattern/min/max)
    if (formRef.current && !formRef.current.reportValidity()) {
      return;
    }

    // 2) Validazioni aggiuntive (più robuste)
    const errors = [];

    if (!isValidAcademicYear(academicYear)) {
      errors.push('Anno accademico non valido. Usa il formato YYYY/YYYY e anni consecutivi (es. 2024/2025).');
    }
    if (!isValidSemester(semester)) {
      errors.push('Seleziona il semestre: 1° semestre o 2° semestre.');
    }
    if (!isValidCredits(credits)) {
      errors.push('CFU deve essere un intero tra 1 e 31.');
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert('Devi effettuare il login come docente per creare un corso.');
      return;
    }

    const payload = {
      ownerId: user.uid,
      titolo: title,
      descrizione: subtitle,
      stato: "attivo",
      introd: {
        academicYear,
        professor: prof, // bloccato dal form
        degree,
        semester,
        credits: credits !== '' ? Number(credits) : null,
        notes,
        officeHoursTitle,
        officeHours,
      },
      initialSectionTitle: sectionTitle || null,
      initialLesson: lessonTitle ? {
        title: lessonTitle,
        fileTypes: currentTypes,
        videoUrl: hasVideo ? videoUrl : "",
        duration,
        description: lessonDesc,
        type: hasVideo ? "video" : (hasPdf ? "reading" : null),
      } : null
    };

    const courseId = await createCourseWithInitialSectionAndLesson(payload);
    navigate(`/docente/corsi/${courseId}`);
  };

  return (
    <div className="cnew-page">
      <div className="cnew-card">
        <div className="cnew-stack">
          {/* UNICO FORM: required attivi su submit */}
          <Form onSubmit={handleSubmit} ref={formRef}>
            {/* HEADER: Titolo + Sottotitolo */}
            <div className="cnew-inner cnew-header">
              <header className="cnew-hero mb-3">
                <h1 className="cnew-hero-title">Crea nuovo corso</h1>
                <p className="cnew-hero-subtitle">
                  Inserisci <b>titolo</b> e <b>sottotitolo</b> (spiegazione generale). Poi compila le
                  <b> informazioni generali</b>. Infine crea una <b>sola sezione</b> con una
                  <b> sola lezione</b> iniziale. Le altre sezioni/lezioni le aggiungerai dalla pagina del corso.
                </p>
              </header>

              <div className="cnew-grid cnew-grid--1col cnew-grid--2col-md">
                <Form.Group className="mb-3 cnew-col-2">
                  <Form.Label className='text-black'>
                    Titolo corso <span style={{color:'#d00'}}>*</span>
                  </Form.Label>
                  <Form.Control
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-0 cnew-col-2">
                  <Form.Label className='text-black'>
                    Sottotitolo / Spiegazione generale <span style={{color:'#d00'}}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Breve spiegazione del corso…"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            {/* BLOCCO 2: Informazioni generali */}
            <div className="cnew-inner cnew-form">
              <h2 className="cnew-block-title">Informazioni generali del corso</h2>

              <div className="cnew-grid cnew-grid--1col cnew-grid--2col-md">
                <Form.Group className="mb-3">
                  <Form.Label>
                    Anno accademico <span style={{color:'#d00'}}>*</span>
                  </Form.Label>
                  <Form.Control
                    placeholder="Es. 2024/2025"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    required
                    pattern="^\d{4}/\d{4}$"
                    title="Usa il formato YYYY/YYYY (es. 2024/2025)"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Docente</Form.Label>
                  <Form.Control
                    placeholder="Nome e cognome docente"
                    value={prof}
                    readOnly
                    disabled
                    title="Questo campo è impostato automaticamente dal tuo profilo e non è modificabile."
                  />
                  <Form.Text className="text-muted">
                    Il docente è bloccato sul tuo profilo: un corso può essere creato solo per se stessi.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Corso di laurea (CdL) <span style={{color:'#d00'}}>*</span>
                  </Form.Label>
                  <Form.Control
                    placeholder="Es. Informatica"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Semestre <span style={{color:'#d00'}}>*</span>
                  </Form.Label>
                  <Form.Select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                  >
                    <option value="">Seleziona…</option>
                    <option value="1° semestre">1° semestre</option>
                    <option value="2° semestre">2° semestre</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    CFU <span style={{color:'#d00'}}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="31"
                    step="1"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Valori consentiti: 1–31.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3 cnew-col-2">
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    placeholder="Note interne/avvisi…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Titolo ricevimento</Form.Label>
                  <Form.Control
                    placeholder="Es. Ricevimento studenti"
                    value={officeHoursTitle}
                    onChange={(e) => setOfficeHoursTitle(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-0">
                  <Form.Label>Ricevimento studenti (orari/note)</Form.Label>
                  <Form.Control
                    placeholder="Es. Lunedì 10-12, studio 2.14…"
                    value={officeHours}
                    onChange={(e) => setOfficeHours(e.target.value)}
                  />
                </Form.Group>
                <small className="text-muted"  ><i style={{color:'#d00'}}>* </i><i style={{color:'rgba(0, 0, 0, 1)'}}>campi obbligatori</i></small>
              </div>
            </div>

            {/* BLOCCO 3: Sezione e lezione iniziale (Opzionale) */}
            <div className="cnew-inner cnew-form mt-3">
              <h2 className="cnew-block-title">Sezione e lezione iniziale (Opzionale)</h2>

              <div className="cnew-grid cnew-grid--1col cnew-grid--2col-md">
                {/* Sezione */}
                <Form.Group className="mb-3 cnew-col-2">
                  <Form.Label>Nome sezione iniziale</Form.Label>
                  <Form.Control
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                  />
                </Form.Group>

                {/* Lezione */}
                <Form.Group className="mb-3 cnew-col-2">
                  <Form.Label>Titolo lezione iniziale</Form.Label>
                  <Form.Control
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-2 cnew-col-2">
                  <Form.Label>Tipologia contenuto</Form.Label>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <Form.Check
                      type="checkbox"
                      id="chk-video-new"
                      label="Contiene Video"
                      checked={hasVideo}
                      onChange={(e) => setHasVideo(e.target.checked)}
                    />
                    <Form.Check
                      type="checkbox"
                      id="chk-pdf-new"
                      label="Contiene PDF"
                      checked={hasPdf}
                      onChange={(e) => setHasPdf(e.target.checked)}
                    />
                  </div>
                  <div className="mb-1">
                    {currentTypes.length > 0
                      ? currentTypes.map(t => (
                          <Badge key={t} bg="light" text="dark" className="me-1">{t}</Badge>
                        ))
                      : <Badge bg="light" text="dark">nessun tipo selezionato</Badge>}
                  </div>
                </Form.Group>

                {hasVideo && (
                  <Form.Group className="mb-3 cnew-col-2">
                    <Form.Label>Link Video</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="https://…"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                  </Form.Group>
                )}

                {hasPdf && (
                  <Form.Group className="mb-3 cnew-col-2">
                    <Form.Label>Carica PDF</Form.Label>
                    <Form.Control type="file" accept="application/pdf" />
                    <Form.Text className="text-muted">
                      Se non carichi un PDF ora, potrai aggiungerlo/modificarlo in seguito.
                    </Form.Text>
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Durata (opzionale)</Form.Label>
                  <Form.Control
                    placeholder="Es. 15 min"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-0 cnew-col-2">
                  <Form.Label>Descrizione lezione (opzionale)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Breve descrizione della lezione…"
                    value={lessonDesc}
                    onChange={(e) => setLessonDesc(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>

            {/* CTA */}
            <div className="cnew-actions">
              <Button
                type="button"
                className="cnew-btn cnew-btn--outline text-white"
                onClick={() => navigate('/docente/corsi')}
              >
                Annulla
              </Button>
              <Button type="submit" className="cnew-btn cnew-btn--primary">
                Salva
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
