import React, { useMemo, useState } from 'react';
import { Button, Form, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Style/TeacherCourseNew.css'; // CSS dedicato (aggiornato)

export default function TeacherCourseNew() {
  const navigate = useNavigate();

  // 1) Titolo & Sottotitolo (sottotitolo = spiegazione generale)
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState(''); // ex "Descrizione/Obiettivi"

  // 2) Informazioni generali
  const [academicYear, setAcademicYear] = useState('');
  const [prof, setProf] = useState('');
  const [degree, setDegree] = useState('');
  const [semester, setSemester] = useState('');
  const [credits, setCredits] = useState('');
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
  // Nota: per il PDF usiamo direttamente l'input file; non salviamo il File nello state (mock)

  const currentTypes = useMemo(
    () => [...(hasVideo ? ['video'] : []), ...(hasPdf ? ['pdf'] : [])],
    [hasVideo, hasPdf]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Nuovo corso creato (mock):\n` +
      `Titolo: ${title}\n` +
      `Sottotitolo: ${subtitle.substring(0, 100)}…\n` +
      `Anno: ${academicYear} | Docente: ${prof}\n` +
      `CdL: ${degree} | Semestre: ${semester} | CFU: ${credits}\n` +
      `Note: ${notes}\n${officeHoursTitle}: ${officeHours}\n` +
      `Sezione iniziale: ${sectionTitle}\n` +
      `Lezione iniziale: ${lessonTitle} [${currentTypes.join(' + ') || '—'}]` +
      (hasVideo ? `\nVideo: ${videoUrl || '—'}` : '') +
      (duration ? `\nDurata: ${duration}` : '') +
      (lessonDesc ? `\nDescrizione lezione: ${lessonDesc}` : '')
    );
    navigate('/docente/corsi');
  };

  return (
    <div className="cnew-page">
      <div className="cnew-card">
        <div className="cnew-stack">
          {/* HEADER: Titolo + Sottotitolo */}
          <div className="cnew-inner cnew-header">
            <header className="cnew-hero">
              <h1 className="cnew-hero-title">Crea nuovo corso</h1>
              <p className="cnew-hero-subtitle">
                Inserisci <b>titolo</b> e <b>sottotitolo</b> (spiegazione generale). Poi compila le
                <b> informazioni generali</b>. Infine crea una <b>sola sezione</b> con una
                <b> sola lezione</b> iniziale. Le altre sezioni/lezioni le aggiungerai dalla pagina del corso.
              </p>
            </header>

            <Form className="cnew-grid cnew-grid--1col cnew-grid--2col-md">
              <Form.Group className="mb-3 cnew-col-2">
                <Form.Label>Titolo corso</Form.Label>
                <Form.Control
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-0 cnew-col-2">
                <Form.Label>Sottotitolo / Spiegazione generale</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Breve spiegazione del corso…"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </Form.Group>
            </Form>
          </div>

          {/* BLOCCO 2: Informazioni generali */}
          <div className="cnew-inner cnew-form">
            <h2 className="cnew-block-title">Informazioni generali del corso</h2>

            <Form className="cnew-grid cnew-grid--1col cnew-grid--2col-md">
              <Form.Group className="mb-3">
                <Form.Label>Anno accademico</Form.Label>
                <Form.Control
                  placeholder="Es. 2024/2025"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Docente</Form.Label>
                <Form.Control
                  placeholder="Es. Prof. Rossi"
                  value={prof}
                  onChange={(e) => setProf(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Corso di laurea (CdL)</Form.Label>
                <Form.Control
                  placeholder="Es. Informatica"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Semestre</Form.Label>
                <Form.Control
                  placeholder="Es. 1° semestre"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>CFU</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="1"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                />
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
            </Form>
          </div>

          {/* BLOCCO 3: Sezione + Lezione iniziale (stesso set input di modifica lezione) */}
          <div className="cnew-inner cnew-form">
            <h2 className="cnew-block-title">Sezione e lezione iniziale</h2>

            <Form className="cnew-grid cnew-grid--1col cnew-grid--2col-md">
              {/* Sezione */}
              <Form.Group className="mb-3 cnew-col-2">
                <Form.Label>Nome sezione iniziale</Form.Label>
                <Form.Control
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Lezione */}
              <Form.Group className="mb-3 cnew-col-2">
                <Form.Label>Titolo lezione iniziale</Form.Label>
                <Form.Control
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  required
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
            </Form>
          </div>

          {/* CTA */}
          <Form onSubmit={handleSubmit} className="cnew-actions">
            <Button type="button" className="cnew-btn cnew-btn--outline" onClick={() => navigate('/docente/corsi')}>
              Annulla
            </Button>
            <Button type="submit" className="cnew-btn cnew-btn--primary">
              Salva
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
