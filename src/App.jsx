import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ScrollToTop    from './components/ScrollToTop';
import Login          from './pages/Login';
import StudentApp     from './student/StudentApp';
import TeacherApp     from './pages/TeacherApp';
import StudentCourses from './components/StudentCourses';
import MyCourses      from './student/MyCourses';
import CourseDetail   from './student/CourseDetail';
import LessonPage     from './student/LessonPage';
import ExploreCourses from './student/ExploreCourses';
import StudentProfile from './student/StudentProfile';
import StudentProfileEdit from './student/StudentProfileEdit';
import StudentFAQ from './student/StudentFAQ';

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
