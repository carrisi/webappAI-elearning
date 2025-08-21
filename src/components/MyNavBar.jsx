// src/components/MyNavBar.jsx
import React, { useState } from 'react';
import Container   from 'react-bootstrap/Container';
import Nav         from 'react-bootstrap/Nav';
import Navbar      from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form        from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button      from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';

import './component-style/MyNavBar.css';

export default function MyNavbar() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    navigate(`/studente/scopri${term ? `?q=${encodeURIComponent(term)}` : ''}`);
  };

  return (
    <Navbar expand="lg" className="mb-4 glass-nav">
      <Container fluid className="px-0">
        <Navbar.Brand as={Link} to="/studente">AI-Learning</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="nav-bar">
            <Nav.Link as={Link} to="/studente/scopri">Scopri</Nav.Link>
            <Nav.Link as={Link} to="/studente/corsi">I miei corsi</Nav.Link>

            {/* Link diretto al profilo */}
            <Nav.Link as={Link} to="/studente/profilo">Profilo</Nav.Link>

            <NavDropdown title="Altro" id="basic-nav-dropdown">
              {/* voce esplicita per il profilo */}
              <NavDropdown.Item as={Link} to="faq">FAQ</NavDropdown.Item>
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
            <Button type="submit" className="btn-cerca" variant="outline-primary">Cerca</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
