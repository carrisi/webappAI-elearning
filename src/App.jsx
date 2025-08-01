import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// importa la pagina di login e i wrapper student/docente
import Login       from './pages/Login';
import StudentApp  from './pages/StudentApp';
import TeacherApp  from './pages/TeacherApp';

export default function App() {
  return (
    <Routes>
      {/* route di login */}
      <Route path="/login" element={<Login />} />

      {/* route protetta per lo studente */}
      <Route path="/studente/*" element={<StudentApp />} />

      {/* route protetta per il docente */}
      <Route path="/docente/*" element={<TeacherApp />} />

      {/* qualsiasi altro URL reindirizza al login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
