// src/components/MyNavBarTeacher.jsx
import React, { useState } from 'react';
import Container   from 'react-bootstrap/Container';
import Nav         from 'react-bootstrap/Nav';
import Navbar      from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form        from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button      from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';

import './component-style/MyNavBarTeacher.css';

export default function MyNavBarTeacher() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    navigate(`/docente/corsi${term ? `?q=${encodeURIComponent(term)}` : ''}`);
  };

  return (
    <Navbar expand="lg" className="mb-4">
      <Container fluid className="px-0">
        <Navbar.Brand as={Link} to="/docente">AI-Learning • Docente</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="nav-bar">
            <Nav.Link as={Link} to="/docente/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/docente/corsi">Corsi</Nav.Link>
            <Nav.Link as={Link} to="/docente/valutazioni">Valutazioni</Nav.Link>
            <Nav.Link as={Link} to="/docente/profilo">Profilo</Nav.Link>

            <NavDropdown title="Altro" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/docente/faq">FAQ Docente</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/docente/impostazioni">Impostazioni</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <Form className="d-flex ms-auto" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Cerca..."
              className="me-2"
              aria-label="Cerca"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button type="submit" className="btn-cerca" variant="outline-primary">
              Cerca
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
