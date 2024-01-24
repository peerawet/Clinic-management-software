import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { Button } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";

function SelectBranch() {
  const navigate = useNavigate();
  const [branchsData, setBranchsData] = useState([]);
  const fetchBranchData = async () => {
    try {
      const response = await axios.get("http://localhost:2001/branchs");

      setBranchsData(response.data.data);
    } catch (error) {
      alert("Error fetching branch data:", error);
    }
  };
  useEffect(() => {
    fetchBranchData();
  }, []);

  return (
    <>
      {branchsData.map((branch, index) => {
        return (
          <Card style={{ width: "18rem", height: "fit-content" }} key={index}>
            <Card.Img
              variant="top"
              src={branch.picture}
              style={{ height: "10rem" }}
            />
            <Card.Body>
              <Card.Title>{branch.name}</Card.Title>
            </Card.Body>

            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Status</Accordion.Header>
                <Accordion.Body>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item>
                      appointment: {branch.appointment}
                    </ListGroup.Item>
                    <ListGroup.Item>check in: {branch.checkIn}</ListGroup.Item>
                    <ListGroup.Item>
                      new patient: {branch.newPatient}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      totalSell: {branch.totalSell}
                    </ListGroup.Item>
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Button
              onClick={() => {
                navigate(`/${branch._id}`);
              }}
            >
              Start
            </Button>
          </Card>
        );
      })}
    </>
  );
}

export default SelectBranch;
