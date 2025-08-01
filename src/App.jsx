import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// importa la pagina di login e i wrapper student/docente
import Login       from './pages/Login';
import StudentApp  from './pages/StudentApp';
import TeacherApp  from './pages/TeacherApp';

// importa i componenti che vogliamo usare come figli di StudentApp
import StudentCourses from './components/StudentCourses';
import MyCourses from './pages/myCourses';

export default function App() {
  return (
    <Routes>
      {/* 1) Pagina di Login */}
      <Route path="/login" element={<Login />} />

      {/* 2) Dashboard Studente */}
      <Route path="/studente" element={<StudentApp />}>
        {/* /student -> StudentCourses */}
        <Route index element={<StudentCourses />} />

        {/* /studente/corsi -> MyCoursesPage */}
        <Route path="corsi" element={<MyCourses />} />
      </Route>

      {/* 3) Dashboard Docente */}
      <Route path="/docente/*" element={<TeacherApp />} />

      {/* qualsiasi altro URL reindirizza al login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
