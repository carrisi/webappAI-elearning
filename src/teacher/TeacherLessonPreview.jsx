// src/teacher/pages/TeacherLessonPreview.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import teacherCourses from '../data/teacherCoursesMock';
import VideoPlayer from '../components/VideoPlayer';
import PDFViewer   from '../components/PDFViewer';
import ChatBox     from '../components/ChatBox';

// Ri-uso degli stessi CSS della versione studente per avere la stessa resa
import '../student/LessonVideoPage';
import '../student/Style/LessonPdfPage.css';
import '../student/Style/LessonVideoPdfPage.css';

export default function TeacherLessonPreview() {
  const { courseId, secId, lezId } = useParams();

  // trova corso → sezione → lezione dal mock docente
  const course  = teacherCourses.find(c => String(c.id) === String(courseId));
  const section = course?.sections.find(s => String(s.id) === String(secId));
  const lesson  = section?.lessons.find(l => String(l.id) === String(lezId));

  if (!course)  return <div className="lesson-video-page"><h1 className="lesson-title">Corso non trovato</h1></div>;
  if (!section) return <div className="lesson-video-page"><h1 className="lesson-title">Sezione non trovata</h1></div>;
  if (!lesson)  return <div className="lesson-video-page"><h1 className="lesson-title">Lezione non trovata</h1></div>;

  const title       = lesson.title || '';
  const description = lesson.description || '';

  // Normalizza metadati e presenza risorse (coerente col lato studente)
  const typeLc = String(lesson.type || '').toLowerCase();
  const fileTypes = Array.isArray(lesson.fileTypes)
    ? lesson.fileTypes.map(t => String(t).toLowerCase())
    : [];

  const hasVideo =
    fileTypes.includes('video') || typeLc === 'video' ||
    Boolean(lesson.videoUrl || lesson.url);

  const hasPdf =
    fileTypes.includes('pdf') || ['pdf','reading'].includes(typeLc) ||
    Boolean(lesson.pdfUrl || lesson.fileUrl || lesson.contentUrl);

  // URL con fallback robusti
  const videoUrl = lesson.videoUrl || lesson.url || '';
  const pdfUrl   = lesson.pdfUrl   || lesson.fileUrl || lesson.contentUrl || '';

  // Misura altezza del riquadro media per allineare la chat (come lato studente)
  const mediaRef = useRef(null);
  const [mediaH, setMediaH] = useState(0);
  useEffect(() => {
    const upd = () => { if (mediaRef.current) setMediaH(mediaRef.current.offsetHeight); };
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);

  // 1) SOLO VIDEO — usa le classi/stili di LessonVideoPage
  if (hasVideo && !hasPdf) {
    return (
      <div className="lesson-video-page">
        <h1 className="lesson-title">{title}</h1>
        {description && <p className="lesson-description">{description}</p>}

        <div className="lesson-content">
          <div className="video-container" ref={mediaRef}>
            {videoUrl ? <VideoPlayer src={videoUrl} /> : <div style={{color:'#fff',padding:'1rem'}}>Video mancante</div>}
          </div>
          <div className="chat-container" style={{ height: mediaH }}>
            <ChatBox />
          </div>
        </div>

        <div className="lesson-summary">
          <h2>Riassunto della lezione</h2>
          <p>Placeholder riassunto AI del video.</p>
        </div>
      </div>
    );
  }

  // 2) SOLO PDF — usa le classi/stili di LessonPdfPage
  if (!hasVideo && hasPdf) {
    return (
      <div className="lesson-pdf-page">
        <h1 className="lesson-title">{title}</h1>
        {description && <p className="lesson-description">{description}</p>}

        <div className="lesson-content">
          <div className="media-pane" ref={mediaRef}>
            <div className="pdf-container">
              {pdfUrl ? <PDFViewer src={pdfUrl} /> : <div style={{padding:'1rem'}}>PDF mancante</div>}
            </div>
          </div>
          <div className="chat-container" style={{ height: mediaH }}>
            <ChatBox />
          </div>
        </div>

        <div className="lesson-summary">
          <h2>Riassunto del PDF</h2>
          <p>Placeholder riassunto AI del PDF.</p>
        </div>
      </div>
    );
  }

  // 3) VIDEO + PDF — usa le classi/stili di LessonVideoPdfPage con toggle
  const [view, setView] = useState('video');
  return (
    <div className="lesson-videopdf-page">
      <h1 className="lesson-title">{title}</h1>
      {description && <p className="lesson-description">{description}</p>}

      <div className="view-toggle">
        <button className={view === 'video' ? 'active' : ''} onClick={() => setView('video')}>Video</button>
        <button className={view === 'pdf'   ? 'active' : ''} onClick={() => setView('pdf')}>PDF</button>
      </div>

      <div className="lesson-content">
        <div className="media-pane" ref={mediaRef}>
          {view === 'video' ? (
            <div className="video-container">
              {videoUrl ? <VideoPlayer src={videoUrl} /> : <div style={{color:'#fff',padding:'1rem'}}>Video mancante</div>}
            </div>
          ) : (
            <div className="pdf-container">
              {pdfUrl ? <PDFViewer src={pdfUrl} /> : <div style={{padding:'1rem'}}>PDF mancante</div>}
            </div>
          )}
        </div>
        <div className="chat-container" style={{ height: mediaH }}>
          <ChatBox />
        </div>
      </div>

      <div className="lesson-summary">
        <h2>Riassunto della lezione {view === 'video' ? 'Video' : 'PDF'}</h2>
        <p>
          Qui verrà visualizzato un riassunto {view === 'video' ? 'del video' : 'del PDF'} creato utilizzando AI, per ora aggiungo un placeholder per riempire lo spazio.
          <br /><br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam perferendis provident sequi dolor, explicabo odio sunt reprehenderit eos, repudiandae iure repellendus modi, expedita qui fuga cumque. Consequuntur, rerum ut? Quasi, tempora corrupti voluptatibus facere expedita rem, quae recusandae nihil perspiciatis blanditiis excepturi. Culpa voluptatibus explicabo fuga dolor sint maxime, soluta voluptatem nobis quam est illo repellendus consequatur eaque pariatur ex, suscipit ab quos at cum? Aspernatur facere eligendi quo quisquam! Placeat provident aut magnam eius non soluta voluptatem quisquam ipsum, aliquam obcaecati. Exercitationem nostrum laboriosam facilis accusantium et porro fugiat illo perferendis magni expedita eaque corrupti, iusto, illum doloremque dolores?
          <br /><br />
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum suscipit voluptatem beatae neque deserunt tenetur, eligendi placeat harum et animi exercitationem iusto quo reprehenderit asperiores eius adipisci consequuntur voluptates maxime optio eveniet laborum! Minus perspiciatis omnis iure maiores debitis illo ullam. Quo amet esse repudiandae nobis aspernatur error est incidunt?
          <br /><br />
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi voluptates recusandae omnis obcaecati consequatur, praesentium magnam aliquid architecto autem reprehenderit quibusdam, officiis facere! Commodi id nihil laborum sit vero non consectetur aut voluptatem excepturi mollitia nemo architecto, hic perferendis officia quas iure iusto earum. Impedit sunt porro dignissimos non at accusamus nemo voluptas quibusdam deleniti eius iusto aliquam magnam suscipit magni quasi sed, mollitia ipsa animi tempore ullam quae rerum.
        </p>
      </div>
    </div>
  );
}
