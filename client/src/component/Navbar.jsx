import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useContext, useState, useEffect } from "react";
import { IsLoginContext } from "../App";

import { useNavigate } from "react-router-dom";

function NavbarComponent() {
  const { isLogin, setIsLogin } = useContext(IsLoginContext);

  const navigate = useNavigate();
  return (
    <Navbar expand="lg" className="bg-body-tertiary ">
      <Container>
        <Navbar.Brand>Clinic Management Software</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              onClick={() => {
                navigate("/branch");
              }}
            >
              Select branch
            </Nav.Link>

            <Nav.Link
              onClick={() => {
                setIsLogin(false);
              }}
            >
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
