import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { Button } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import axios from "axios";

function Status() {
  const [branchData, setBranchData] = useState({});
  const params = useParams();

  const fetchBranchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2001/branchs/${params.id}`
      );
      setBranchData(response.data.data);
    } catch (error) {
      alert("Error fetching branch data:", error);
    }
  };

  useEffect(() => {
    fetchBranchData();
  }, []);

  return (
    <div
      css={css`
        margin-top: 1rem;
      `}
    >
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={branchData.picture} />
        <Card.Body>
          <Card.Title>{branchData.name}</Card.Title>
        </Card.Body>

        <Accordion defaultActiveKey="0" flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Status</Accordion.Header>
            <Accordion.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>appointment:</ListGroup.Item>
                <ListGroup.Item>check in: </ListGroup.Item>
                <ListGroup.Item>new patient:</ListGroup.Item>
                <ListGroup.Item>totalSale:</ListGroup.Item>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Button>See Statistic</Button>
      </Card>
    </div>
  );
}

export default Status;
