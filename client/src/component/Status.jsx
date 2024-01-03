import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBranchData } from "../data/branchData";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { Button } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */

function Status() {
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
  const params = useParams();
  return (
    <div
      css={css`
        margin-top: 1rem;
      `}
    >
      {branchData
        .filter((branch) => {
          return branch.id === params.id;
        })
        .map((detail, index) => {
          return (
            <Card key={index} style={{ width: "18rem" }}>
              <Card.Img variant="top" src={detail.picture} />
              <Card.Body>
                <Card.Title>{detail.name}</Card.Title>
              </Card.Body>

              <Accordion defaultActiveKey="0" flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Status</Accordion.Header>
                  <Accordion.Body>
                    <ListGroup className="list-group-flush">
                      <ListGroup.Item>
                        appointment: {detail.appointment}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        check in: {detail.checkIn}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        new patient: {detail.newPatient}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        totalSell: {detail.totalSell}
                      </ListGroup.Item>
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <Button>See Statistic</Button>
            </Card>
          );
        })}
    </div>
  );
}

export default Status;
