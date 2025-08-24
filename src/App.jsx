// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ScrollToTop    from './components/ScrollToTop';
import Login          from './pages/Login';

/* ===== STUDENTE ===== */
import StudentApp           from './student/StudentApp';
import StudentCourses       from './components/StudentCourses';
import MyCourses            from './student/MyCourses';
import CourseDetail         from './student/CourseDetail';
import LessonPage           from './student/LessonPage';
import ExploreCourses       from './student/ExploreCourses';
import StudentProfile       from './student/StudentProfile';
import StudentProfileEdit   from './student/StudentProfileEdit';
import StudentFAQ           from './student/StudentFAQ';

/* ===== DOCENTE ===== */
import TeacherApp           from './teacher/TeacherApp';
import TeacherCourses       from './teacher/TeacherCourses';
import TeacherCourseDetail  from './teacher/TeacherCourseDetail';
import TeacherSectionNew    from './teacher/TeacherSectionNew';
import TeacherLessonEdit    from './teacher/TeacherLessonEdit';
import TeacherLessonNew     from './teacher/TeacherLessonNew';
import TeacherLessonPreview from './teacher/TeacherLessonPreview';

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* ===== LATO STUDENTE ===== */}
        <Route path="/studente" element={<StudentApp />}>
          <Route index element={<StudentCourses />} />
          <Route path="corsi" element={<MyCourses />} />
          <Route path="scopri" element={<ExploreCourses />} />
          <Route path="profilo" element={<StudentProfile />} />
          <Route path="impostazioni" element={<StudentProfileEdit />} />
          <Route path="faq" element={<StudentFAQ />} />
          <Route path="corsi/:id" element={<CourseDetail />} />
          <Route path="corsi/:id/sezioni/:secId/lezioni/:lezId" element={<LessonPage />} />
        </Route>

        {/* ===== LATO DOCENTE ===== */}
        <Route path="/docente" element={<TeacherApp />}>
          {/* TeacherApp rende la landing su /docente */}
          <Route path="corsi" element={<TeacherCourses />} />
          <Route path="corsi/:courseId" element={<TeacherCourseDetail />} />

          {/* Lezioni */}
          <Route path="corsi/:courseId/sezioni/:secId/lezioni/nuova" element={<TeacherLessonNew />} />
          <Route path="corsi/:courseId/sezioni/:secId/lezioni/:lezId" element={<TeacherLessonPreview />} />
          <Route path="corsi/:courseId/sezioni/nuova" element={<TeacherSectionNew />} />
          <Route path="corsi/:courseId/sezioni/:secId/lezioni/:lezId/modifica" element={<TeacherLessonEdit />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
