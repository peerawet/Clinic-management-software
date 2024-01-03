import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useContext, useState, useEffect } from "react";
import { IsLoginContext } from "../App";
import { getBranchData } from "../data/branchData";
import { useNavigate } from "react-router-dom";

function NavbarComponent() {
  const { isLogin, setIsLogin } = useContext(IsLoginContext);
  const [branchData, setBranchData] = useState([]);
  const fetchBranchData = async () => {
    try {
      const fetchResult = await getBranchData();
      setBranchData(fetchResult);
    } catch (error) {
      alert("Error fetching branch data:", error);
    }
  };
  useEffect(() => {
    fetchBranchData();
  }, []);
  const navigate = useNavigate();
  return (
    <Navbar expand="lg" className="bg-body-tertiary ">
      <Container>
        <Navbar.Brand>Clinic Management Software</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title="Select Branch" id="basic-nav-dropdown">
              {branchData.map((branch, index) => {
                return (
                  <NavDropdown.Item
                    key={index}
                    onClick={() => {
                      navigate(`/${branch.id}`);
                    }}
                  >
                    {branch.name}
                  </NavDropdown.Item>
                );
              })}
            </NavDropdown>
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
