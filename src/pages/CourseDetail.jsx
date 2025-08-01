// src/pages/CourseDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import mockCourses from '../data/mockCourses';

export default function CourseDetail() {
  const { id } = useParams();
  const corso = mockCourses.find(c => c.id === +id);

  if (!corso) {
    return (
      <Container className="py-5">
        <h3>Corso non trovato</h3>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2>{corso.titolo}</h2>
      <p>{corso.descrizione}</p>
      <p><strong>Stato:</strong> {corso.stato}</p>
      {/* Qui puoi aggiungere dettagli estesi, moduli, video, Q&A, ecc. */}
    </Container>
  );
}
