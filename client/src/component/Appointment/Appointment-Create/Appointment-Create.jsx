import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import React from "react";

import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import SearchPatient from "./SearchPatient";
import SearchDoctor from "./SearchDoctor";

function AppointmentCreate({ searchPatients, setSearchPatients }) {
  const initialDate = new Date();
  initialDate.setHours(9, 0, 0, 0);
  const [selectedStartDate, setSelectedStartDate] = useState(initialDate);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showButtonPatient, setShowButtonPatient] = useState(false);
  const [showButtonDoctor, setShowButtonDoctor] = useState(false);
  const [searchDoctors, setSearchDoctors] = useState([]);
  const [newAppointmentId, setNewAppointmentId] = useState("");

  const params = useParams();

  const handleCreateAppointment = async () => {
    if (
      searchPatients.length === 1 &&
      searchDoctors.length === 1 &&
      showButtonDoctor === false &&
      showButtonPatient === false
    ) {
      try {
        const doctor = searchDoctors[0];
        const patient = searchPatients[0];
        const startDate = selectedStartDate;
        const endDate = selectedEndDate;
        const response = await axios.post(
          `http://localhost:2001/appointments/${params.id}/${doctor._id}`,
          {
            start: startDate,
            end: endDate,
            HN: patient._id,
            license: doctor._id,
            status: "booked",
            branch: params.id.toUpperCase(),
          }
        );
        const appointmentId = response.data.data;
        setNewAppointmentId(appointmentId);
        alert("Appointment has been created");
        setSearchDoctors([]);
        setSearchPatients([]);
      } catch (error) {
        alert(`Error creating appointment: ${error.message}`);
      }
    } else {
      alert("Please fill out the information completely.");
    }
  };

  return (
    <>
      <div
        css={css`
          display: flex;
          flex-direction: row;
          gap: 1rem;
          border: solid gray 1px;
          border-radius: 10px;
          padding: 1rem;
          @media (max-width: 720px) {
            flex-direction: column;
          }
        `}
      >
        <SearchPatient
          searchPatients={searchPatients}
          setSearchPatients={setSearchPatients}
          showButtonPatient={showButtonPatient}
          setShowButtonPatient={setShowButtonPatient}
        />
        <SearchDoctor
          setShowButtonDoctor={setShowButtonDoctor}
          selectedStartDate={selectedStartDate}
          setSelectedStartDate={setSelectedStartDate}
          setSearchDoctors={setSearchDoctors}
          searchDoctors={searchDoctors}
          showButtonDoctor={showButtonDoctor}
          selectedEndDate={selectedEndDate}
          setSelectedEndDate={setSelectedEndDate}
        />
      </div>

      <div
        css={css`
          display: flex;
        `}
      >
        <Button
          onClick={handleCreateAppointment}
          css={css`
            width: 50%;
          `}
        >
          Create Appointment
        </Button>
        <FloatingLabel
          label="New Appointment ID"
          css={css`
            width: 50%;
          `}
        >
          <Form.Control
            type="text"
            value={newAppointmentId}
            disabled
            readOnly
          />
        </FloatingLabel>
      </div>
    </>
  );
}

export default AppointmentCreate;
