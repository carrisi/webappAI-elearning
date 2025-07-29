// src/components/MyNavBar.jsx
import React from 'react';
import Container   from 'react-bootstrap/Container';
import Nav         from 'react-bootstrap/Nav';
import Navbar      from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form        from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button      from 'react-bootstrap/Button';
import { Link }    from 'react-router-dom';

import './component-style/MyNavBar.css';

export default function MyNavbar() {
  return (
    <Navbar expand="lg" className="mb-4 glass-nav">
      <Container fluid className="px-0">
        {/* Brand che torna alla root */}
        <Navbar.Brand as={Link} to="/">
          AI-Learning
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="nav-bar">
            {/* I “due bottoni” */}
            <Nav.Link as={Link} to="/studente">
              Home Studente
            </Nav.Link>
            <Nav.Link as={Link} to="/docente">
              Home Docente
            </Nav.Link>

            {/* Il dropdown con tre voci */}
            <NavDropdown title="Profilo" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/profile">
                Il mio profilo
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/settings">
                Impostazioni
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/logout">
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* Barra di ricerca spinta a destra */}
          <Form className="d-flex ms-auto" onSubmit={e => e.preventDefault()}>
            <FormControl
              type="search"
              placeholder="Cerca..."
              className="me-2"
              aria-label="Cerca"
            />
            <Button className='btn-cerca' variant="outline-primary">Cerca</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}