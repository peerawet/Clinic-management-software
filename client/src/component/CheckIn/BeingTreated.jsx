import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import axios from "axios";
import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";

function BeingTreated({
  activeTab,
  beingTreatedRender,
  setBeingTreatedRender,
  setSearchPatients,
  setActiveTab,
}) {
  useEffect(() => {
    fetchBeingtreatedToday();
  }, [activeTab]);

  const fetchBeingtreatedToday = async () => {
    const beingTreatedToday = await axios.get(
      "http://localhost:2001/beingtreated"
    );
    console.log(beingTreatedToday);
    setBeingTreatedRender(beingTreatedToday.data.data);
  };

  const handleCheckOut = async (id) => {
    const response = await axios.get(
      `http://localhost:2001/appointments/${id}`
    );
    const appointment = response.data.data;
    await axios.put(`http://localhost:2001/appointments/${id}`, {
      ...appointment,
      status: "completed",
    });
    await axios.delete(`http://localhost:2001/beingtreated/${id}`);
    const updateBeingTreatedList = await axios.get(
      "http://localhost:2001/beingtreated"
    );
    setBeingTreatedRender(updateBeingTreatedList.data.data);
  };

  const handleAppointmentAndCheckOut = async (HN, id) => {
    handleCheckOut(id);
    setActiveTab("Appointment");
    const patientToAppointment = await axios.get(
      `http://localhost:2001/patients/${HN}`
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
                Patient name : {beingTreated.patientInfo.firstName}{" "}
                {beingTreated.patientInfo.surName}
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
                        value={beingTreated.patientInfo.HN}
                        disabled
                        readOnly
                      />
                    </FloatingLabel>
                    <FloatingLabel label="Patient name">
                      <Form.Control
                        type="text"
                        value={`${beingTreated.patientInfo.firstName} ${beingTreated.patientInfo.surName}`}
                        disabled
                        readOnly
                      />
                    </FloatingLabel>
                    <FloatingLabel label="Course remaining">
                      <Form.Control
                        type="text"
                        value={beingTreated.patientInfo.courseRemaining}
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
                        value={beingTreated.doctorInfo.license}
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
                value={beingTreated.id}
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
                  value={`Date : ${beingTreated.day}-${beingTreated.month}-${beingTreated.year}`}
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
                  value={`time : ${beingTreated.time}.00-${String(
                    Number(beingTreated.time) + 1
                  )}.00`}
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
                handleAppointmentAndCheckOut(beingTreated.HN, beingTreated.id);
              }}
            >
              Appointment and Check Out
            </Button>
            <Button
              css={css`
                flex: 1;
              `}
              onClick={() => {
                handleCheckOut(beingTreated.id);
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
