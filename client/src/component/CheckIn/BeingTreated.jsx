import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import axios from "axios";

import Accordion from "react-bootstrap/Accordion";
import { format } from "date-fns";

function BeingTreated({
  beingTreatedRender,
  setSearchPatients,
  setActiveTab,
  fetchBeingTreated,
}) {
  const handleCheckOut = async (appointment) => {
    const newAppointment = { ...appointment };
    delete newAppointment.doctorInfo;
    delete newAppointment.patientInfo;
    await axios.put(
      `http://localhost:2001/appointments/${newAppointment._id}`,
      {
        ...newAppointment,
        status: "completed",
        checkOut: new Date(),
      }
    );
    fetchBeingTreated();
  };

  const handleAppointmentAndCheckOut = async (appointment) => {
    handleCheckOut(appointment);
    setActiveTab("Appointment");
    const patientToAppointment = await axios.get(
      `http://localhost:2001/patients/${appointment.HN}`
    );
    const patientToAppointmentArray = [{ ...patientToAppointment.data.data }];
    setSearchPatients(patientToAppointmentArray);
  };

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
        border: solid black 1px;
        width: 50%;
        padding: 1rem;
        border-radius: 10px;
      `}
    >
      <h4>Being treated</h4>
      {beingTreatedRender.map((beingTreated) => (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 1rem;
            border: solid black 1px;
            width: 100%;
            padding: 1rem;
            border-radius: 10px;
          `}
        >
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                Patient name : {beingTreated.patientInfo.name}
              </Accordion.Header>
              <Accordion.Body>
                <div
                  css={css`
                    display: flex;
                    flex-direction: row;
                  `}
                >
                  <img
                    css={css`
                      width: 13rem;
                    `}
                    src={beingTreated.patientInfo.picture}
                  ></img>
                  <div
                    css={css`
                      display: flex;
                      flex-direction: column;
                      flex: 1;
                      gap: 1rem;
                    `}
                  >
                    <FloatingLabel label="HN">
                      <Form.Control
                        type="text"
                        value={beingTreated.patientInfo._id}
                        disabled
                        readOnly
                      />
                    </FloatingLabel>
                    <FloatingLabel label="Patient name">
                      <Form.Control
                        type="text"
                        value={beingTreated.patientInfo.name}
                        disabled
                        readOnly
                      />
                    </FloatingLabel>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                Doctor name : {beingTreated.doctorInfo.name}
              </Accordion.Header>
              <Accordion.Body>
                <div
                  css={css`
                    display: flex;
                    flex-direction: row;
                  `}
                >
                  <img
                    css={css`
                      width: 13rem;
                    `}
                    src={beingTreated.doctorInfo.picture}
                  ></img>
                  <div
                    css={css`
                      display: flex;
                      flex-direction: column;
                      width: 50%;
                      gap: 1rem;
                    `}
                  >
                    <FloatingLabel label="Doctor name">
                      <Form.Control
                        type="text"
                        value={beingTreated.doctorInfo.name}
                        disabled
                        readOnly
                      />
                    </FloatingLabel>
                    <FloatingLabel label="License">
                      <Form.Control
                        type="text"
                        value={beingTreated.doctorInfo._id}
                        disabled
                        readOnly
                      />
                    </FloatingLabel>
                    <FloatingLabel label="Branch">
                      <Form.Control
                        type="text"
                        value={beingTreated.doctorInfo.branch}
                        disabled
                        readOnly
                      />
                    </FloatingLabel>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 1rem;
            `}
          >
            <FloatingLabel
              css={css`
                width: 100%;
              `}
              label="Appointment ID"
            >
              <Form.Control
                type="text"
                value={beingTreated._id}
                disabled
                readOnly
              />
            </FloatingLabel>
            <div
              css={css`
                display: flex;
                gap: 1rem;
              `}
            >
              <FloatingLabel
                css={css`
                  width: 100%;
                `}
                label="Date"
              >
                <Form.Control
                  type="text"
                  value={format(beingTreated.start, "MMMM d, yyyy")}
                  disabled
                  readOnly
                />
              </FloatingLabel>
              <FloatingLabel
                css={css`
                  width: 100%;
                `}
                label="time"
              >
                <Form.Control
                  type="text"
                  value={`${format(beingTreated.start, "hh.mm a")} - ${format(
                    beingTreated.end,
                    "hh.mm a"
                  )}`}
                  disabled
                  readOnly
                />
              </FloatingLabel>
            </div>
          </div>

          <div
            css={css`
              display: flex;
              gap: 1rem;
            `}
          >
            <Button
              css={css`
                flex: 1;
              `}
              onClick={() => {
                handleAppointmentAndCheckOut(beingTreated);
              }}
            >
              Appointment and Check Out
            </Button>
            <Button
              css={css`
                flex: 1;
              `}
              onClick={() => {
                handleCheckOut(beingTreated);
              }}
            >
              Check out
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BeingTreated;
