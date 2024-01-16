import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import axios from "axios";
import Accordion from "react-bootstrap/Accordion";
import Treatment from "./Treatment";
import { format } from "date-fns";

function ConfirmAppointments({
  isComfirmpatient,
  listAppointments,
  fetchAppointmentsToday,
  fetchBeingTreated,
}) {
  const handleCheckIn = async (appointment) => {
    delete appointment.doctorInfo;
    delete appointment.patientInfo;

    await axios.put(`http://localhost:2001/appointments/${appointment._id}`, {
      ...appointment,
      status: "being treated",
      checkIn: new Date(),
    });

    await axios.post("http://localhost:2001/beingtreated", {
      ...appointment,
      status: "being treated",
    });

    await fetchAppointmentsToday();
    await fetchBeingTreated();
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
      <h4>Please confirm appointments</h4>

      {listAppointments.map((appointment, index) => (
        <div
          key={index}
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
              <Accordion.Header>{`Patient name : ${appointment.patientInfo.name}`}</Accordion.Header>
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
                    src={appointment.patientInfo.picture}
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
                        value={appointment.patientInfo._id}
                        disabled
                        readOnly
                      />
                    </FloatingLabel>

                    <FloatingLabel label="Patient name">
                      <Form.Control
                        type="text"
                        value={`${appointment.patientInfo.name}`}
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
                {`Doctor name : ${appointment.doctorInfo.name}`}
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
                    src={appointment.doctorInfo.picture}
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
                        value={appointment.doctorInfo.name}
                        disabled
                        readOnly
                      />
                    </FloatingLabel>
                    <FloatingLabel label="License">
                      <Form.Control
                        type="text"
                        value={appointment.doctorInfo._id}
                        disabled
                        readOnly
                      />
                    </FloatingLabel>
                    <FloatingLabel label="Branch">
                      <Form.Control
                        type="text"
                        value={appointment.doctorInfo.branch}
                        disabled
                        readOnly
                      />
                    </FloatingLabel>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <FloatingLabel
            css={css`
              width: 100%;
            `}
            label="Appointment ID"
          >
            <Form.Control
              type="text"
              value={appointment._id}
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
                value={format(appointment.start, "MMMM d, yyyy")}
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
                value={`${format(appointment.start, "hh.mm a")} - ${format(
                  appointment.end,
                  "hh.mm a"
                )}`}
                disabled
                readOnly
              />
            </FloatingLabel>
          </div>
          <Treatment />
          <Button
            css={css`
              width: 100%;
              display: ${isComfirmpatient ? "none" : "block"};
            `}
            onClick={() => handleCheckIn(appointment)}
          >
            Check In
          </Button>
        </div>
      ))}
    </div>
  );
}

export default ConfirmAppointments;
