import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import format from "date-fns/format";
import SearchPatient from "./SearchPatient";
import SearchDoctor from "./SearchDoctor";

function AppointmentCreate({ searchPatients, setSearchPatients }) {
  const [showButtonPatient, setShowButtonPatient] = useState(false);
  const [showButtonDoctor, setShowButtonDoctor] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("09");
  const [searchDoctors, setSearchDoctors] = useState([]);
  const [newAppointmentId, setNewAppointmentId] = useState("");

  const params = useParams();

  //patients section

  //doctors section

  //create appointment section

  const handleCreateAppointment = async () => {
    if (
      searchPatients.length === 1 &&
      searchDoctors.length === 1 &&
      showButtonDoctor === false &&
      showButtonPatient === false
    ) {
      try {
        const appointmentId = await createAppointmentIdAndPost();
        setNewAppointmentId(appointmentId);

        alert("Appointment has been created");
      } catch (error) {
        alert(`Error creating appointment: ${error.message}`);
      }
    } else {
      alert("Please fill out the information completely.");
    }
  };

  const formatDate = () => {
    const date = format(selectedDate, "yyyy-MM-dd");
    const dateArray = date.split("-");
    const dateObject = {
      year: dateArray[0] || "",
      month: dateArray[1] || "",
      day: dateArray[2] || "",
    };
    return dateObject;
  };

  const createAppointmentIdAndPost = async () => {
    const dateObject = formatDate();
    const time = selectedTime;
    const patient = searchPatients[0];
    const doctor = searchDoctors[0];
    const branch = params.id.toLocaleUpperCase();
    const appointmentId = `APPT-${branch}-${dateObject.day}-${dateObject.month}-${dateObject.year}-${time}-${doctor.license}-${patient.HN}`;
    await axios.post("http://localhost:2001/appointments/", {
      id: `APPT-${branch}-${dateObject.day}-${dateObject.month}-${dateObject.year}-${time}-${doctor.license}-${patient.HN}`,
      day: dateObject.day,
      month: dateObject.month,
      year: dateObject.year,
      time: time,
      HN: patient.HN,
      license: doctor.license,
      status: "booked",
      branch: params.id.toLocaleUpperCase(),
    });
    return appointmentId;
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
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setSelectedTime={setSelectedTime}
          setSearchDoctors={setSearchDoctors}
          selectedTime={selectedTime}
          searchDoctors={searchDoctors}
          showButtonDoctor={showButtonDoctor}
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
