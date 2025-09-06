import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Style/TeacherLessonPreview.css';

import ChatBox from '../components/ChatBox';
import { getCourseById, listSections, listLessons } from '../services/courses';

export default function TeacherLessonPreview() {
  const { courseId, secId: secIdRaw, sectionId, lezId: lezIdRaw, lessonId } = useParams();
  const secId = secIdRaw || sectionId;
  const lezId = lezIdRaw || lessonId;

  const [courseOK, setCourseOK]   = useState(true);
  const [sectionOK, setSectionOK] = useState(true);
  const [lesson, setLesson]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [view, setView]           = useState('video');

  // desktop breakpoint (>= 992px)
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 992px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 992px)');
    const handler = (e) => setIsDesktop(e.matches);
    try { mq.addEventListener('change', handler); } catch { mq.addListener(handler); }
    return () => {
      try { mq.removeEventListener('change', handler); } catch { mq.removeListener(handler); }
    };
  }, []);

  // Misuro l'altezza effettiva del media (video/pdf) per pareggiare la chat SOLO su desktop
  const mediaRef = useRef(null);
  const [mediaH, setMediaH] = useState(0);

  const measure = () => {
    const root = mediaRef.current;
    if (!root) return;
    const el = root.querySelector('.video-container, .pdf-container');
    if (el) setMediaH(el.getBoundingClientRect().height);
  };

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (mediaRef.current) ro.observe(mediaRef.current);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rimisura quando cambia view o lesson
  useEffect(() => { measure(); }, [view, lesson]);

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

  if (loading)    return <div className="lesson-video-page"><h1 className="lesson-title">Caricamento…</h1></div>;
  if (!courseOK)  return <div className="lesson-video-page"><h1 className="lesson-title">Corso non trovato</h1></div>;
  if (!sectionOK) return <div className="lesson-video-page"><h1 className="lesson-title">Sezione non trovata</h1></div>;
  if (!lesson)    return <div className="lesson-video-page"><h1 className="lesson-title">Lezione non trovata</h1></div>;

  const title       = lesson.title || '';
  const description = lesson.description || '';

  const typeLc    = String(lesson.type || '').toLowerCase();
  const fileTypes = Array.isArray(lesson.fileTypes) ? lesson.fileTypes.map(t => String(t).toLowerCase()) : [];

  const hasVideo = fileTypes.includes('video') || typeLc === 'video' || Boolean(lesson.videoUrl);
  const hasPdf   = fileTypes.includes('pdf')   || ['pdf','reading'].includes(typeLc) || Boolean(lesson.pdfUrl);

  const videoUrl = lesson.videoUrl || '';
  const pdfUrl   = lesson.pdfUrl   || '';

  // Utility: stile altezza chat: desktop pareggia, responsive auto
  const chatHeightStyle = isDesktop
    ? { height: mediaH }
    : { height: 'min(60vh, 520px)' }; // altezza fissa in responsive

  // --- SOLO VIDEO ---
  if (hasVideo && !hasPdf) {
    return (
      <div className="lesson-video-page">
        <h1 className="lesson-title">{title}</h1>
        {description && <p className="lesson-description">{description}</p>}

        <div className="lesson-content">
          <div className="media-pane" ref={mediaRef}>
            <div className="video-container">
              {videoUrl
                ? <video
                    controls
                    style={{ width: '100%', height: '100%', borderRadius: 12 }}
                    src={videoUrl}
                    onLoadedMetadata={measure}
                  />
                : <div style={{color:'#fff',padding:'1rem'}}>Video mancante</div>}
            </div>
          </div>

          <div className="chat-container" style={chatHeightStyle}>
            <div className="chat-fill">
              <ChatBox variant="standalone" showHeader placeholder="Chiedi alla ChatAI..." />
            </div>
          </div>
        </div>

        <div className="lesson-summary">
          <h2>Riassunto della lezione Video</h2>
          <p>
            Qui verrà visualizzato un riassunto del Video creato utilizzando AI, per ora aggiungo un placeholder per riempire lo spazio.
            <br /><br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae nemo excepturi, dolorem enim, libero cumque facere aliquam, sed sit quae odio officia iure delectus placeat et veritatis incidunt unde vitae accusantium assumenda atque voluptates. Libero voluptatum cumque, obcaecati laudantium eveniet dolores, reiciendis hic repellat a laboriosam eaque excepturi quae distinctio saepe consequatur perspiciatis! Et sit iste, dignissimos cumque iure doloremque quam accusamus provident ipsa doloribus dolores id commodi non voluptatem officiis vel necessitatibus veritatis illo. Facere, qui in! Nam rerum perspiciatis eveniet porro maxime, obcaecati iusto et culpa, minima, aut fugiat ratione sequi eum saepe? Impedit beatae, magnam laborum similique facilis officia deserunt expedita optio deleniti explicabo dignissimos voluptate tenetur fuga ratione laboriosam inventore. Labore beatae ratione repellendus similique in sapiente ex inventore fugit et nobis vitae consequuntur dignissimos, suscipit perferendis, autem earum. Nostrum ad illum eos commodi ipsa corporis quia illo aspernatur dolore? Non minus blanditiis tempore tenetur nemo?
            <br /><br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem libero eum sed harum! Explicabo atque culpa assumenda quisquam debitis necessitatibus rerum non aut, odit ducimus. Quidem inventore at iusto aliquid delectus eius ullam sunt? Amet libero ducimus, voluptas doloribus soluta maiores inventore debitis! Consectetur alias omnis, neque facere, dicta nemo, quos hic ipsa rem magnam libero ipsam molestias. Quibusdam ducimus iste accusamus nam repudiandae debitis blanditiis nisi dolores. Voluptate aperiam magni qui tempora, nihil, ea fugiat mollitia ratione, non ipsa iste ut? Fugit laboriosam, ad, et facere aliquam incidunt voluptatibus quae laudantium praesentium impedit eaque nihil eveniet est aspernatur facilis dignissimos distinctio dolor debitis. Debitis illum harum laudantium sapiente blanditiis maxime cum rerum totam, libero excepturi, placeat ullam, quidem ea expedita commodi nobis fuga delectus nihil aliquid porro odio sint! Explicabo, dolore esse modi repellat, commodi adipisci a optio atque quos aspernatur sed recusandae molestiae. Consequuntur deleniti asperiores perferendis sed.
          </p>
        </div>
      </div>
    );
  }

  // --- SOLO PDF ---
  if (!hasVideo && hasPdf) {
    return (
      <div className="lesson-pdf-page">
        <h1 className="lesson-title">{title}</h1>
        {description && <p className="lesson-description">{description}</p>}

        <div className="lesson-content">
          <div className="media-pane" ref={mediaRef}>
            <div className="pdf-container">
              {pdfUrl
                ? <iframe
                    title="pdf"
                    src={pdfUrl}
                    style={{ width: '100%', height: '100%', border: 0, borderRadius: 12 }}
                    onLoad={measure}
                  />
                : <div style={{padding:'1rem'}}>PDF mancante</div>}
            </div>
          </div>

          <div className="chat-container" style={chatHeightStyle}>
            <div className="chat-fill">
              <ChatBox variant="standalone" showHeader placeholder="Chiedi alla ChatAI..." />
            </div>
          </div>
        </div>

        <div className="lesson-summary">
          <h2>Riassunto della lezione PDF</h2>
          <p>
            Qui verrà visualizzato un riassunto del PDF creato utilizzando AI, per ora aggiungo un placeholder per riempire lo spazio.
            <br /><br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae nemo excepturi, dolorem enim, libero cumque facere aliquam, sed sit quae odio officia iure delectus placeat et veritatis incidunt unde vitae accusantium assumenda atque voluptates. Libero voluptatum cumque, obcaecati laudantium eveniet dolores, reiciendis hic repellat a laboriosam eaque excepturi quae distinctio saepe consequatur perspiciatis! Et sit iste, dignissimos cumque iure doloremque quam accusamus provident ipsa doloribus dolores id commodi non voluptatem officiis vel necessitatibus veritatis illo. Facere, qui in! Nam rerum perspiciatis eveniet porro maxime, obcaecati iusto et culpa, minima, aut fugiat ratione sequi eum saepe? Impedit beatae, magnam laborum similique facilis officia deserunt expedita optio deleniti explicabo dignissimos voluptate tenetur fuga ratione laboriosam inventore. Labore beatae ratione repellendus similique in sapiente ex inventore fugit et nobis vitae consequuntur dignissimos, suscipit perferendis, autem earum. Nostrum ad illum eos commodi ipsa corporis quia illo aspernatur dolore? Non minus blanditiis tempore tenetur nemo?
            <br /><br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem libero eum sed harum! Explicabo atque culpa assumenda quisquam debitis necessitatibus rerum non aut, odit ducimus. Quidem inventore at iusto aliquid delectus eius ullam sunt? Amet libero ducimus, voluptas doloribus soluta maiores inventore debitis! Consectetur alias omnis, neque facere, dicta nemo, quos hic ipsa rem magnam libero ipsam molestias. Quibusdam ducimus iste accusamus nam repudiandae debitis blanditiis nisi dolores. Voluptate aperiam magni qui tempora, nihil, ea fugiat mollitia ratione, non ipsa iste ut? Fugit laboriosam, ad, et facere aliquam incidunt voluptatibus quae laudantium praesentium impedit eaque nihil eveniet est aspernatur facilis dignissimos distinctio dolor debitis. Debitis illum harum laudantium sapiente blanditiis maxime cum rerum totam, libero excepturi, placeat ullam, quidem ea expedita commodi nobis fuga delectus nihil aliquid porro odio sint! Explicabo, dolore esse modi repellat, commodi adipisci a optio atque quos aspernatur sed recusandae molestiae. Consequuntur deleniti asperiores perferendis sed.
          </p>
        </div>
      </div>
    );
  }

  // --- VIDEO + PDF (toggle) ---
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
                ? <video
                    controls
                    style={{ width: '100%', height: '100%', borderRadius: 12 }}
                    src={videoUrl}
                    onLoadedMetadata={measure}
                  />
                : <div style={{color:'#fff',padding:'1rem'}}>Video mancante</div>}
            </div>
          ) : (
            <div className="pdf-container">
              {pdfUrl
                ? <iframe
                    title="pdf"
                    src={pdfUrl}
                    style={{ width: '100%', height: '100%', border: 0, borderRadius: 12 }}
                    onLoad={measure}
                  />
                : <div style={{padding:'1rem'}}>PDF mancante</div>}
            </div>
          )}
        </div>

        <div className="chat-container" style={chatHeightStyle}>
          <div className="chat-fill">
            <ChatBox variant="standalone" showHeader placeholder="Chiedi alla ChatAI..." />
          </div>
        </div>
      </div>

      <div className="lesson-summary">
        <h2>Riassunto della lezione {view === 'video' ? 'Video' : 'PDF'}</h2>
        <p>
            Qui verrà visualizzato un riassunto del {view === 'video' ? 'Video' : 'PDF'} creato utilizzando AI, per ora aggiungo un placeholder per riempire lo spazio.
            <br /><br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae nemo excepturi, dolorem enim, libero cumque facere aliquam, sed sit quae odio officia iure delectus placeat et veritatis incidunt unde vitae accusantium assumenda atque voluptates. Libero voluptatum cumque, obcaecati laudantium eveniet dolores, reiciendis hic repellat a laboriosam eaque excepturi quae distinctio saepe consequatur perspiciatis! Et sit iste, dignissimos cumque iure doloremque quam accusamus provident ipsa doloribus dolores id commodi non voluptatem officiis vel necessitatibus veritatis illo. Facere, qui in! Nam rerum perspiciatis eveniet porro maxime, obcaecati iusto et culpa, minima, aut fugiat ratione sequi eum saepe? Impedit beatae, magnam laborum similique facilis officia deserunt expedita optio deleniti explicabo dignissimos voluptate tenetur fuga ratione laboriosam inventore. Labore beatae ratione repellendus similique in sapiente ex inventore fugit et nobis vitae consequuntur dignissimos, suscipit perferendis, autem earum. Nostrum ad illum eos commodi ipsa corporis quia illo aspernatur dolore? Non minus blanditiis tempore tenetur nemo?
            <br /><br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem libero eum sed harum! Explicabo atque culpa assumenda quisquam debitis necessitatibus rerum non aut, odit ducimus. Quidem inventore at iusto aliquid delectus eius ullam sunt? Amet libero ducimus, voluptas doloribus soluta maiores inventore debitis! Consectetur alias omnis, neque facere, dicta nemo, quos hic ipsa rem magnam libero ipsam molestias. Quibusdam ducimus iste accusamus nam repudiandae debitis blanditiis nisi dolores. Voluptate aperiam magni qui tempora, nihil, ea fugiat mollitia ratione, non ipsa iste ut? Fugit laboriosam, ad, et facere aliquam incidunt voluptatibus quae laudantium praesentium impedit eaque nihil eveniet est aspernatur facilis dignissimos distinctio dolor debitis. Debitis illum harum laudantium sapiente blanditiis maxime cum rerum totam, libero excepturi, placeat ullam, quidem ea expedita commodi nobis fuga delectus nihil aliquid porro odio sint! Explicabo, dolore esse modi repellat, commodi adipisci a optio atque quos aspernatur sed recusandae molestiae. Consequuntur deleniti asperiores perferendis sed.
        </p>
      </div>
    </div>
  );
}




