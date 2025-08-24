// src/pages/LessonPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import mockCourses from '../data/mockCourses';
import LessonVideoPage from './LessonVideoPage';
import LessonVideoPdfPage from './LessonVideoPdfPage';
import LessonPdfPage from './LessonPdfPage';

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

  // normalizza metadati
  const typeLc = (lesson.type || '').toLowerCase();
  const fileTypes = Array.isArray(lesson.fileTypes)
    ? lesson.fileTypes.map(t => String(t).toLowerCase())
    : [];

  // presenza risorse (tollerante a mock diversi)
  const hasVideo =
    fileTypes.includes('video') ||
    typeLc === 'video' ||
    Boolean(lesson.videoUrl || lesson.url);

  const hasPdf =
    fileTypes.includes('pdf') ||
    typeLc === 'pdf' ||
    typeLc === 'reading' ||
    Boolean(lesson.pdfUrl || lesson.fileUrl || lesson.contentUrl);

  // URL risorse (fallback robusti)
  const videoUrl = lesson.videoUrl || lesson.url || '';
  const pdfUrl = lesson.pdfUrl || lesson.fileUrl || lesson.contentUrl || '';

  // video + pdf
  if (hasVideo && hasPdf) {
    return (
      <LessonVideoPdfPage
        title={lesson.title}
        videoUrl={videoUrl}
        pdfUrl={pdfUrl}
      />
    );
  }

  // solo pdf
  if (!hasVideo && hasPdf) {
    return <LessonPdfPage title={lesson.title} pdfUrl={pdfUrl} />;
  }

  // solo video
  if (hasVideo && !hasPdf) {
    return <LessonVideoPage title={lesson.title} videoUrl={videoUrl} />;
  }

  // non supportato
  return <div>Tipo di lezione non supportato</div>;
}
