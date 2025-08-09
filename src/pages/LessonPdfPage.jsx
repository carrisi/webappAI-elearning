// src/pages/LessonPdfPage.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import mockCourses   from '../data/mockCourses';
import PDFViewer     from '../components/PDFViewer';
import ChatBox       from '../components/ChatBox';
import './Style/LessonPdfPage.css';

export default function LessonPdfPage() {
  const { id, secId, lezId } = useParams();
  const course   = mockCourses.find(c => c.id === +id);
  const section  = course?.sections.find(s => s.id === +secId);
  const lesson   = section?.lessons.find(l => l.id === +lezId);

  const title       = lesson?.title || '';
  const description = lesson?.description || '';
  const pdfUrl      = lesson?.fileUrl || lesson?.contentUrl || '';

  // misura altezza del media-pane (PDF 16:9) e applicala alla chat
  const mediaRef = useRef(null);
  const [mediaHeight, setMediaHeight] = useState(0);

  useEffect(() => {
    function updateHeight() {
      if (mediaRef.current) setMediaHeight(mediaRef.current.offsetHeight);
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div className="lesson-pdf-page">
      <h1 className="lesson-title">{title}</h1>
      {description && <p className="lesson-description">{description}</p>}

      <div className="lesson-content">
        <div className="media-pane" ref={mediaRef}>
          <div className="pdf-container">
            <PDFViewer src={pdfUrl} />
          </div>
        </div>

        <div className="chat-container" style={{ height: mediaHeight }}>
          <ChatBox />
        </div>
      </div>

      <div className="lesson-summary">
        <h2>Riassunto del PDF</h2>
        <p>
          Qui verrà visualizzato un riassunto del PDF creato utilizzando AI, per ora aggiungo un placeholder per riempire lo spazio.
          <br /><br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam perferendis provident sequi dolor, explicabo odio sunt reprehenderit eos, repudiandae iure repellendus modi, expedita qui fuga cumque. Consequuntur, rerum ut?
          <br /><br />
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum suscipit voluptatem beatae neque deserunt tenetur, eligendi placeat harum et animi exercitationem iusto quo reprehenderit asperiores eius adipisci consequuntur voluptates maxime.
        </p>
      </div>
    </div>
  );
}
