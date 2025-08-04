// src/pages/LessonPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import mockCourses   from '../data/mockCourses';
import LessonVideoPage from './LessonVideoPage';

export default function LessonPage() {
  // prendi i parametri dalla URL
  const { id, secId, lezId } = useParams();

  // trova corso → sezione → lezione
  const course = mockCourses.find(c => c.id === +id);
  if (!course) return <div>Corso non trovato</div>;

  const section = course.sections.find(s => s.id === +secId);
  if (!section) return <div>Sezione non trovata</div>;

  const lesson = section.lessons.find(l => l.id === +lezId);
  if (!lesson) return <div>Lezione non trovata</div>;

  // supportiamo per ora solo video
  if (lesson.type !== 'video') {
    return <div>Tipo di lezione non supportato (qui solo video)</div>;
  }

  // qui ci aspettiamo di avere una proprietà `url` o `videoUrl` su lesson
  // altrimenti rimane vuoto e visualizzerà solo il player a schermo nero
  const videoUrl = lesson.url || lesson.videoUrl || '';

  return (
    <LessonVideoPage
      title={lesson.title}
      videoUrl={videoUrl}
    />
  );
}
