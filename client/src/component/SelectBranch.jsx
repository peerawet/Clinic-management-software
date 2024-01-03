import { useState, useEffect } from "react";
import { getBranchData } from "../data/branchData";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { Button } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";

function SelectBranch() {
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
    <>
      {branchData.map((branch) => {
        return (
          <Card style={{ width: "18rem", height: "fit-content" }}>
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
                navigate(`/${branch.id}`);
              }}
            >
              Start
            </Button>
          </Card>
        );
      })}
      <Card style={{ width: "18rem", height: "fit-content" }}>
        <Card.Img
          variant="top"
          src="data:image/png;base64,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"
        />
        <Card.Body>
          <Card.Title>Add new branch</Card.Title>

          <Button variant="primary">Add new branch</Button>
        </Card.Body>
      </Card>
    </>
  );
}

export default SelectBranch;
