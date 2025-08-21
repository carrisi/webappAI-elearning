import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ScrollToTop    from './components/ScrollToTop';
import Login          from './pages/Login';
import StudentApp     from './pages/StudentApp';
import TeacherApp     from './pages/TeacherApp';
import StudentCourses from './components/StudentCourses';
import MyCourses      from './pages/MyCourses';
import CourseDetail   from './pages/CourseDetail';
import LessonPage     from './pages/LessonPage';
import ExploreCourses from './pages/ExploreCourses';
import StudentProfile from './pages/StudentProfile';
import StudentProfileEdit from './pages/StudentProfileEdit';
import StudentFAQ from './pages/StudentFAQ';

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Layout Studente (NavBar + Outlet) */}
        <Route path="/studente" element={<StudentApp />}>
          {/* Landing Page */}
          <Route index element={<StudentCourses />} />

          {/* I miei corsi */}
          <Route path="corsi" element={<MyCourses />} />

          {/* Scopri nuovi corsi */}
          <Route path="scopri" element={<ExploreCourses />} />

          {/* Profilo studente */}
          <Route path="profilo" element={<StudentProfile />} />

          {/* Modifica Profilo studente */}
          <Route path="impostazioni" element={<StudentProfileEdit />} />

          {/* FAQ */}
          <Route path="faq" element={<StudentFAQ />} />

          {/* Dettaglio corso */}
          <Route path="corsi/:id" element={<CourseDetail />} />

          {/* Lezione Video */}
          <Route
            path="corsi/:id/sezioni/:secId/lezioni/:lezId"
            element={<LessonPage />}
          />
        </Route>

        {/* Layout Docente */}
        <Route path="/docente/*" element={<TeacherApp />} />

        {/* Redirect per tutte le altre */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
