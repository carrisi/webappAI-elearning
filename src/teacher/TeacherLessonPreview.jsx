import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../student/Style/LessonPdfPage.css';
import '../student/Style/LessonVideoPdfPage.css';
import ChatBox from '../components/ChatBox';
import { getCourseById, listSections, listLessons } from '../services/courses';

export default function TeacherLessonPreview() {
  const { courseId, secId: secIdRaw, sectionId, lezId: lezIdRaw, lessonId } = useParams();
  const secId = secIdRaw || sectionId;
  const lezId = lezIdRaw || lessonId;

  // hook SEMPRE in top-level
  const [courseOK, setCourseOK]   = useState(true);
  const [sectionOK, setSectionOK] = useState(true);
  const [lesson, setLesson]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [view, setView]           = useState('video');   // <-- spostato in alto

  const mediaRef = useRef(null);
  const [mediaH, setMediaH] = useState(0);
  useEffect(() => {
    const upd = () => { if (mediaRef.current) setMediaH(mediaRef.current.offsetHeight); };
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const c = await getCourseById(courseId);
        if (!alive) return;
        if (!c) { setCourseOK(false); setLoading(false); return; }

        const secs = await listSections(courseId);
        if (!alive) return;
        const ok = secs.some(s => String(s.id) === String(secId));
        setSectionOK(ok);
        if (!ok) { setLoading(false); return; }

        const lez = await listLessons(courseId, secId);
        if (!alive) return;
        setLesson(lez.find(x => String(x.id) === String(lezId)) || null);
      } catch (e) {
        console.error('TeacherLessonPreview load', e);
        setLesson(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [courseId, secId, lezId]);

  if (loading)        return <div className="lesson-video-page"><h1 className="lesson-title">Caricamento…</h1></div>;
  if (!courseOK)      return <div className="lesson-video-page"><h1 className="lesson-title">Corso non trovato</h1></div>;
  if (!sectionOK)     return <div className="lesson-video-page"><h1 className="lesson-title">Sezione non trovata</h1></div>;
  if (!lesson)        return <div className="lesson-video-page"><h1 className="lesson-title">Lezione non trovata</h1></div>;

  const title       = lesson.title || '';
  const description = lesson.description || '';

  const typeLc    = String(lesson.type || '').toLowerCase();
  const fileTypes = Array.isArray(lesson.fileTypes) ? lesson.fileTypes.map(t => String(t).toLowerCase()) : [];

  const hasVideo = fileTypes.includes('video') || typeLc === 'video' || Boolean(lesson.videoUrl);
  const hasPdf   = fileTypes.includes('pdf')   || ['pdf','reading'].includes(typeLc) || Boolean(lesson.pdfUrl);

  const videoUrl = lesson.videoUrl || '';
  const pdfUrl   = lesson.pdfUrl   || '';

  // SOLO VIDEO
  if (hasVideo && !hasPdf) {
    return (
      <div className="lesson-video-page">
        <h1 className="lesson-title">{title}</h1>
        {description && <p className="lesson-description">{description}</p>}

        <div className="lesson-content">
          <div className="video-container" ref={mediaRef}>
            {videoUrl
              ? <video controls style={{ width: '100%', height: '100%', borderRadius: 12 }} src={videoUrl} />
              : <div style={{color:'#fff',padding:'1rem'}}>Video mancante</div>}
          </div>
          <div className="chat-container">
            <ChatBox variant="standalone" showHeader placeholder="Chiedi alla ChatAI..." />
          </div>
        </div>

        <div className="lesson-summary">
        <h2>Riassunto della lezione Video</h2>
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

  // SOLO PDF
  if (!hasVideo && hasPdf) {
    return (
      <div className="lesson-pdf-page">
        <h1 className="lesson-title">{title}</h1>
        {description && <p className="lesson-description">{description}</p>}

        <div className="lesson-content">
          <div className="media-pane" ref={mediaRef}>
            <div className="pdf-container">
              {pdfUrl
                ? <iframe title="pdf" src={pdfUrl} style={{ width: '100%', height: '100%', border: 0, borderRadius: 12 }} />
                : <div style={{padding:'1rem'}}>PDF mancante</div>}
            </div>
          </div>
          <div className="chat-container" style={{ minHeight: mediaH }}>
            <ChatBox variant="standalone" showHeader placeholder="Chiedi alla ChatAI..." />
          </div>
        </div>

        <div className="lesson-summary">
        <h2>Riassunto della lezione PDF</h2>
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

  // VIDEO + PDF
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
              {videoUrl
                ? <video controls style={{ width: '100%', height: '100%', borderRadius: 12 }} src={videoUrl} />
                : <div style={{color:'#fff',padding:'1rem'}}>Video mancante</div>}
            </div>
          ) : (
            <div className="pdf-container">
              {pdfUrl
                ? <iframe title="pdf" src={pdfUrl} style={{ width: '100%', height: '100%', border: 0, borderRadius: 12 }} />
                : <div style={{padding:'1rem'}}>PDF mancante</div>}
            </div>
          )}
        </div>
        <div className="chat-container" style={{ minHeight: mediaH }}>
          <ChatBox variant="standalone" showHeader placeholder="Chiedi alla ChatAI..." />
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




