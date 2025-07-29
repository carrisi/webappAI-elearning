// src/components/StudentCourses.jsx
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import './component-style/StudentCourses.css';

const courses = [
  {
    id: 1,
    title: 'Introduzione alla Programmazione',
    description: 'Fondamenti di variabili, cicli e strutture dati.',
    image: 'https://via.placeholder.com/300x180'
  },
  {
    id: 2,
    title: 'Machine Learning',
    description: 'Apprendi i concetti chiave di classificazione e regressione.',
    image: 'https://via.placeholder.com/300x180'
  },
  {
    id: 3,
    title: 'Basi di Dati',
    description: 'SQL, modelli relazionali e progettazione.',
    image: 'https://via.placeholder.com/300x180'
  },
  // puoi aggiungerne altri
];

export default function StudentCourses() {
  return (
    <section className="course-section">
      <h2 className="section-title">I tuoi corsi</h2>
      <div className="carousel-wrapper">
        <div className="card-carousel">
          {courses.map(course => (
            <Card className="course-card" key={course.id}>
              <Card.Img variant="top" src={course.image} />
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text>{course.description}</Card.Text>
                <Button variant="primary">Vai al corso</Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
