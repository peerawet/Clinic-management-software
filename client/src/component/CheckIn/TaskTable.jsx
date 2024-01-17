import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import axios from "axios";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
import { useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

function TaskTable({
  listAppointments,
  setSelectedAppointment,
  setShowModal,
  selectDate,
}) {
  const handleShowModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const startTime = new Date(selectDate);
  startTime.setHours(9, 0, 0, 0);
  const endTime = new Date(selectDate);
  endTime.setHours(19, 0, 0, 0);
  const timestampsArray = [];
  for (
    let time = startTime.getTime();
    time <= endTime.getTime();
    time += 60 * 60 * 1000
  ) {
    timestampsArray.push(time);
  }

  const accessDoctors = listAppointments.map(
    (appointment) => appointment.doctorInfo.name
  );
  const doctors = Array.from(new Set(accessDoctors));

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th></th>
          {doctors.map((doctor, index) => (
            <th
              key={index}
              css={css`
                text-align: center;
              `}
            >
              {doctor}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timestampsArray.map((timestamp, rowIndex) => {
          const doctorAppointments = doctors.map((doctor) =>
            listAppointments.filter(
              (appointment) => appointment.doctorInfo.name === doctor
            )
          );

          return (
            <tr key={rowIndex}>
              <td
                css={css`
                  text-align: center;
                `}
              >
                {new Date(timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              {doctorAppointments.map((appointments, colIndex) => {
                const matchingAppointment = appointments.find(
                  (appointment) =>
                    new Date(appointment.start).getTime() === timestamp
                );

                return (
                  <td
                    key={colIndex}
                    css={css`
                      text-align: center;
                    `}
                  >
                    {matchingAppointment && (
                      <div
                        variant="primary"
                        onClick={() => handleShowModal(matchingAppointment)}
                      >
                        {matchingAppointment.HN}
                        {matchingAppointment.status === "booked" && (
                          <ProgressBar variant="info" now={20} />
                        )}
                        {matchingAppointment.status === "being treated" && (
                          <ProgressBar variant="warning" now={40} />
                        )}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default TaskTable;
