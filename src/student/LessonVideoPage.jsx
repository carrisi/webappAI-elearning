// src/pages/LessonVideoPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import mockCourses   from '../data/mockCourses';
import VideoPlayer   from '../components/VideoPlayer';
import ChatBox       from '../components/ChatBox';
import './Style/LessonVideoPage.css';

export default function LessonVideoPage({ title, videoUrl }) {
  const { id, secId, lezId } = useParams();
  const course  = mockCourses.find(c => c.id === +id);
  const section = course?.sections.find(s => s.id === +secId);
  const lesson  = section?.lessons.find(l => l.id === +lezId);
  const description = lesson?.description || '';

  // ref e stato per altezza video
  const videoRef = useRef(null);
  const [mediaHeight, setMediaHeight] = useState(0);

  useEffect(() => {
    function updateHeight() {
      if (videoRef.current) {
        setMediaHeight(videoRef.current.offsetHeight);
      }
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div className="lesson-video-page">
      <h1 className="lesson-title">{title}</h1>
      {description && <p className="lesson-description">{description}</p>}

      <div className="lesson-content">
        <div className="video-container" ref={videoRef}>
          <VideoPlayer src={videoUrl} />
        </div>
        <div
          className="chat-container"
          style={{ height: mediaHeight }}
        >
          <ChatBox variant="standalone" showHeader placeholder="Chiedi alla ChatAI..." />
        </div>
      </div>

      <div className="lesson-summary">
        <h2>Riassunto della lezione</h2>
        <p>
          Qui verrà visualizzato un riassunto della lezione creato utilizzando AI, per ora aggiungo un placeholder per riempire lo spazio.
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
