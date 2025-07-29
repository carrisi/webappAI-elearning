// src/components/StudentCourses.jsx
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import './component-style/StudentCourses.css';
import PlaceholderStudentCourse from '../assets/images/PlaceholderStudentCourse.png';

const courses = [
  {
    id: 1,
    title: 'Programmazione I',
    description: 'Studio dei fondamenti della programmazione imperativa e orientata agli oggetti. Approfondisce strutture dati, algoritmi, gestione della memoria e debugging.',
    image: PlaceholderStudentCourse
  },
  {
    id: 2,
    title: 'Interazione Uomo-Macchina',
    description: 'Analisi dei principi per progettare interfacce usabili ed efficaci. Include ergonomia, progettazione centrata sull’utente, prototipazione e valutazione dell’usabilità.',
    image: PlaceholderStudentCourse
  },
  {
    id: 3,
    title: 'Basi di Dati',
    description: 'Insegna a modellare, progettare e interrogare basi di dati relazionali. Comprende SQL, normalizzazione, transazioni e gestione dei dati persistenti.',
    image: PlaceholderStudentCourse
  },
  {
    id: 4,
    title: 'Ingegneria della conoscenza',
    description: 'Tratta la modellazione della conoscenza e l’uso di sistemi intelligenti. Include rappresentazione simbolica, apprendimento automatico e ragionamento incerto',
    image: PlaceholderStudentCourse
  },
  {
    id: 5,
    title: 'Architettura degli elaboratori',
    description: 'Esplora la struttura interna dei calcolatori: CPU, memoria, bus, input/output. Introduce anche linguaggi a basso livello e funzionamento logico dell’hardware.',
    image: PlaceholderStudentCourse
  },
  {
    id: 6,
    title: "Metodi per il ritrovamento dell'informazione",
    description: 'Studio dei sistemi per cercare, filtrare e classificare documenti. Copre modelli booleani, vettoriali, ranking e metodi per valutare la qualità dei risultati.',
    image: PlaceholderStudentCourse
  },
];

// helper per troncare
const truncate = (text, max) =>
  text.length > max ? text.slice(0, max - 1) + '…' : text;

export default function StudentCourses() {
  return (
    <section className="course-section">
      <h2 className="section-title">Recentemente seguiti:</h2>
      <div className="carousel-wrapper">
        <div className="card-carousel">
          {courses.map(course => (
            <Card className="course-card" key={course.id}>
              <Card.Img variant="top" src={course.image} />
              <Card.Body className="card-body">
                <Card.Title>{truncate(course.title, 30)}</Card.Title>
                <Card.Text>{truncate(course.description, 90)}</Card.Text>
                <Button variant="primary">Vai al corso</Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
