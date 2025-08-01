// src/pages/CourseDetail.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, Tab, Accordion, ListGroup } from 'react-bootstrap';
import MyNavbar from '../components/MyNavBar';
import mockCourses from '../data/mockCourses';
import './Style/CourseDetail.css';

export default function CourseDetail() {
  const { id } = useParams();
  const corso = mockCourses.find(c => c.id === +id);

  return (
    <>
      <MyNavbar />

      <div className="course-detail-page">
        {!corso ? (
          <div className="cd-not-found">
            <h3>Corso non trovato</h3>
          </div>
        ) : (
          <>
            <h2 className="cd-title">{corso.titolo}</h2>

            <div className="glass-nav-container glass-nav">
              <Tabs defaultActiveKey="corso" id="course-detail-tabs" className="cd-tabs">
                <Tab eventKey="corso" title="Corso">
                  {/* unico box glass per accademico + breve */}
                  <div className="glass-intro-container mb-4">
                    <div className="intro-year">{corso.introduzione.academicYear}</div>
                    <h5 className="intro-professor">{corso.introduzione.professor}</h5>
                    <div className="intro-degree">
                      {corso.introduzione.degree} – {corso.introduzione.semester}, {corso.introduzione.credits} CFU
                    </div>
                    <hr />
                    <div className="intro-notes">{corso.introduzione.notes}</div>
                    <h6 className="intro-office-title">{corso.introduzione.officeHoursTitle}</h6>
                    <div className="intro-office">{corso.introduzione.officeHours}</div>

                    <hr />

                    <h5>Obbiettivi del corso</h5>
                    <p>{corso.descrizione}</p>
                  </div>

                  {/* Accordion sezioni */}
                  <Accordion
                    alwaysOpen
                    defaultActiveKey={corso.sections.map(s => s.id.toString())}
                    className="cd-accordion"
                  >
                    {corso.sections.map(sec => (
                      <Accordion.Item eventKey={sec.id.toString()} key={sec.id}>
                        <Accordion.Header>{sec.title}</Accordion.Header>
                        <Accordion.Body>
                          <ListGroup variant="flush">
                            {sec.lessons.map(lez => (
                              <ListGroup.Item
                                key={lez.id}
                                action
                                as={Link}
                                to={`/studente/corsi/${corso.id}/sezioni/${sec.id}/lezioni/${lez.id}`}
                                className="glass-card clickable-card mb-2"
                              >
                                {lez.title}
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Tab>

                <Tab eventKey="valutazioni" title="Valutazioni">
                  <p>Qui compariranno i voti e i feedback del corso.</p>
                </Tab>

                <Tab eventKey="altro" title="Altro">
                  <p>Altre risorse, Q&amp;A, materiali scaricabili…</p>
                </Tab>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </>
  );
}
