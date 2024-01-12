import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import axios from "axios";
import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";

function Treatment() {
  const [physicalTherapy, setPhysicalTherapy] = useState(false);
  const [shockWaveTherapy, setShockWaveTherapy] = useState(false);
  const [highLaserTherapy, setHighLaserTherapy] = useState(false);
  const [stretchTherapy, setStretchTherapy] = useState(false);
  const [massage, setMassage] = useState(false);
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Treatment</Accordion.Header>
        <Accordion.Body>
          <Form>
            <Form.Check
              type="switch"
              label="Physical therapy"
              onChange={() => setPhysicalTherapy(!physicalTherapy)}
            />

            <Form.Check
              type="switch"
              label="Shock wave therapy"
              onChange={() => setShockWaveTherapy(!shockWaveTherapy)}
            />
            <Form.Check
              type="switch"
              label="High laser therapy"
              onChange={() => setHighLaserTherapy(!highLaserTherapy)}
            />
            <Form.Check
              type="switch"
              label="Streth therapy"
              onChange={() => setStretchTherapy(!stretchTherapy)}
            />
            <Form.Check
              type="switch"
              label="Massage"
              onChange={() => setMassage(!massage)}
            />
            {physicalTherapy && <p>Display content for Physical therapy</p>}
            {shockWaveTherapy && <p>Display content for Shock wave therapy</p>}
            {highLaserTherapy && <p>Display content for High laser therapy</p>}
            {stretchTherapy && <p>Display content for Stretch therapy</p>}
            {massage && <p>Display content for Massage</p>}
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default Treatment;
