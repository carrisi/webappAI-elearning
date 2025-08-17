import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ScrollToTop    from './components/ScrollToTop';
import Login          from './pages/Login';
import StudentApp     from './pages/StudentApp';
import TeacherApp     from './pages/TeacherApp';
import Hero           from './components/Hero';
import StudentCourses from './components/StudentCourses';
import MyCourses      from './pages/MyCourses';
import CourseDetail   from './pages/CourseDetail';
import LessonPage     from './pages/LessonPage';
import ExploreCourses from './pages/ExploreCourses';

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Layout Studente (NavBar + Outlet) */}
        <Route path="/studente" element={<StudentApp />}>  
          {/* Dashboard: Hero + lista corsi */}
          <Route
            index
            element={
              <>
                <Hero />
                <StudentCourses />
              </>
            }
          />

          {/* I miei corsi: Hero + MyCourses */}
          <Route
            path="corsi"
            element={
              <>
                <Hero />
                <MyCourses />
              </>
            }
          />
          
          {/* Scopri nuovi corsi */}
          <Route path="scopri" element={<ExploreCourses />} />

          {/* Dettaglio corso: NavBar + CourseDetail */}
          <Route
            path="corsi/:id"
            element={<CourseDetail />}
          />

          {/* Lezione Video: LessonPage */}
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
