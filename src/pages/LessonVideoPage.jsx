// src/pages/LessonVideoPage.jsx
import React from 'react';
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

  return (
    <div className="lesson-video-page">
      <h1 className="lesson-title">{title}</h1>
      {description && <p className="lesson-description">{description}</p>}

      <div className="lesson-content">
        <div className="video-container">
          <VideoPlayer src={videoUrl} />
        </div>
        <div className="chat-container">
          <ChatBox />
        </div>
      </div>

      <div className="lesson-summary">
        <h2>Riassunto della lezione</h2>
        <p>
          Qui verrà visualizzato un riassunto della lezione creato utilizzando AI, per ora aggiungo un placeholder per riempire lo spazio.
          <br /> <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam perferendis provident sequi dolor, explicabo odio sunt reprehenderit eos, repudiandae iure repellendus modi, expedita qui fuga cumque. Consequuntur, rerum ut? Quasi, tempora corrupti voluptatibus facere expedita rem, quae recusandae nihil perspiciatis blanditiis excepturi. Culpa voluptatibus explicabo fuga dolor sint maxime, soluta voluptatem nobis quam est illo repellendus consequatur eaque pariatur ex, suscipit ab quos at cum? Aspernatur facere eligendi quo quisquam! Placeat provident aut magnam eius non soluta voluptatem quisquam ipsum, aliquam obcaecati. Exercitationem nostrum laboriosam facilis accusantium et porro fugiat illo perferendis magni expedita eaque corrupti, iusto, illum doloremque dolores?
          <br /> <br />
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum suscipit voluptatem beatae neque deserunt tenetur, eligendi placeat harum et animi exercitationem iusto quo reprehenderit asperiores eius adipisci consequuntur voluptates maxime optio eveniet laborum! Minus perspiciatis omnis iure maiores debitis illo ullam. Quo amet esse repudiandae nobis aspernatur error est incidunt?
          <br /> <br />
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi voluptates recusandae omnis obcaecati consequatur, praesentium magnam aliquid architecto autem reprehenderit quibusdam, officiis facere! Commodi id nihil laborum sit vero non consectetur aut voluptatem excepturi mollitia nemo architecto, hic perferendis officia quas iure iusto earum. Impedit sunt porro dignissimos non at accusamus nemo voluptas quibusdam deleniti eius iusto aliquam magnam suscipit magni quasi sed, mollitia ipsa animi tempore ullam quae rerum. Aperiam reiciendis inventore quibusdam repellendus quae quas esse, maxime fuga, reprehenderit accusantium iure distinctio temporibus voluptas minima adipisci deleniti dolorum ducimus fugiat impedit, dolores illo ipsam delectus! Voluptate eligendi inventore nesciunt libero nobis rem soluta? Fugiat officia ipsa sed vel eius dignissimos expedita maiores. Illo saepe, nostrum delectus accusantium consequatur repellat nemo dignissimos aliquam nesciunt officiis voluptatem dolor, reprehenderit quas quidem culpa nobis at eum cumque non fuga? Possimus mollitia dolore deleniti repudiandae corrupti laborum, temporibus corporis suscipit ex veritatis eaque recusandae voluptate saepe quia ducimus animi tempora est. Animi consectetur perferendis veritatis assumenda, magnam quis repellendus vel quibusdam nemo obcaecati ducimus culpa. Architecto recusandae veritatis aperiam odio rem repellat excepturi inventore, beatae molestias repellendus iste itaque sed assumenda, et saepe esse. Qui quo ad, quam laborum voluptatem error, ipsa nulla vel saepe eos doloribus necessitatibus beatae fugit dolorum dolores corporis adipisci, alias modi repudiandae a vero minus! Nulla, deserunt quam eligendi beatae maxime autem doloribus odit tempore sapiente debitis praesentium necessitatibus deleniti vero minima et adipisci quae. Ut tenetur assumenda fugit adipisci maxime at ipsam, molestias consequatur quasi esse dignissimos facere, accusantium cum facilis! Libero laudantium iure quam mollitia, aperiam maiores sit voluptatum fugiat nam architecto molestiae aliquid inventore earum. Sunt laudantium ex dolorum sit, quam accusamus, delectus modi omnis totam aliquam vitae ducimus incidunt assumenda molestias maxime nesciunt voluptatum, officiis eveniet culpa explicabo saepe iure qui? Magnam, placeat.
        </p>
      </div>
    </div>
  );
}
