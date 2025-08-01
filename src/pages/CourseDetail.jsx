// src/pages/CourseDetail.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Tabs, Tab, ListGroup } from 'react-bootstrap';
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
      <h2 className="mb-3">{corso.titolo}</h2>

      <Tabs defaultActiveKey="corso" id="course-detail-tabs" className="mb-4">
        {/* TAB “Corso” */}
        <Tab eventKey="corso" title="Corso">
          {/* Introduzione */}
          <div
            className="mb-4 p-3 glass-box"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h5>Introduzione</h5>
            <p>{corso.descrizione}</p>
          </div>

          {/* Sezioni e lezioni */}
          {corso.sections.map(sec => (
            <div key={sec.id} className="mb-4">
              <h6>{sec.title}</h6>
              <ListGroup>
                {sec.lessons.map((lez, idx) => (
                  <ListGroup.Item
                    key={idx}
                    action
                    as={Link}
                    to={`/studente/corsi/${corso.id}/sezioni/${sec.id}/lezioni/${idx + 1}`}
                    className="glass-card clickable-card mb-2"
                  >
                    {lez}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          ))}
        </Tab>

        {/* TAB “Valutazioni” */}
        <Tab eventKey="valutazioni" title="Valutazioni">
          <p>Qui compariranno i voti e i feedback del corso.</p>
        </Tab>

        {/* TAB “Altro” */}
        <Tab eventKey="altro" title="Altro">
          <p>Altre risorse, Q&A, materiali scaricabili…</p>
        </Tab>
      </Tabs>
    </Container>
  );
}
