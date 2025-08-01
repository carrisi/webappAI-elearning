// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ScrollToTop     from './components/ScrollToTop';
import Login           from './pages/Login';
import StudentApp      from './pages/StudentApp';
import TeacherApp      from './pages/TeacherApp';
import Hero            from './components/Hero';
import StudentCourses  from './components/StudentCourses';
import MyCourses       from './pages/MyCourses';
import CourseDetail    from './pages/CourseDetail';

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Layout Studente (NavBar + Outlet) */}
        <Route path="/studente" element={<StudentApp />}>
          {/* Dashboard: Hero + StudentCourses */}
          <Route
            index
            element={
              <>
                <Hero />
                <StudentCourses />
              </>
            }
          />
          {/* I miei corsi: Hero + lista corsi */}
          <Route
            path="corsi"
            element={
              <>
                <Hero />
                <MyCourses />
              </>
            }
          />
        </Route>

        {/* Dettaglio corso: pagina standalone con solo NavBar + CourseDetail */}
        <Route path="/studente/corsi/:id" element={<CourseDetail />} />

        {/* Layout Docente */}
        <Route path="/docente/*" element={<TeacherApp />} />

        {/* Redirect per tutte le altre */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
