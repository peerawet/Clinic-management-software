import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import BeingTreated from "./BeingTreated";
import ConfirmAppointments from "./ConfirmAppointments";
import axios from "axios";

function CheckIn({ setActiveTab, setSearchPatients, activeTab }) {
  const [searchBox, setSearchBox] = useState("");
  const [listAppointments, setListAppointments] = useState([]);
  const [beingTreatedRender, setBeingTreatedRender] = useState([]);
  const [isComfirmpatient, setIsComfirmpatient] = useState(false);
  let checkInDate = new Date();

  useEffect(() => {
    fetchAppointmentsToday();
  }, [activeTab]);

  useEffect(() => {
    fetchBeingTreated();
  }, [activeTab]);

  const fetchAppointmentsToday = async () => {
    const currentDate = new Date();
    const todayTimeStamp = currentDate.getTime();
    const response = await axios.get(
      `http://localhost:2001/appointments/appointments-today/${todayTimeStamp}`
    );

    const appointmentsToday = response.data.data;
    const appointmentsTodayWithPatientInfo = await Promise.all(
      appointmentsToday.map(async (appointment) => {
        const response = await axios.get(
          `http://localhost:2001/patients/${appointment.HN}`
        );
        const patient = response.data.data;
        return {
          ...appointment,
          patientInfo: patient,
        };
      })
    );
    const appointmentsTodayWithPatientAndDoctorInfo = await Promise.all(
      appointmentsTodayWithPatientInfo.map(async (appointment) => {
        const response = await axios.get(
          `http://localhost:2001/doctors/${appointment.license}`
        );
        const doctor = response.data.data;
        return {
          ...appointment,
          doctorInfo: doctor,
        };
      })
    );
    setListAppointments(appointmentsTodayWithPatientAndDoctorInfo);
  };

  const fetchBeingTreated = async () => {
    try {
      const response = await axios.get("http://localhost:2001/appointments/", {
        params: {
          status: "being treated",
        },
      });
      const beingTreated = response.data.data;

      const beingTreatedWithPatientInfo = await Promise.all(
        beingTreated.map(async (appointment) => {
          const response = await axios.get(
            `http://localhost:2001/patients/${appointment.HN}`
          );
          const patient = response.data.data;
          return {
            ...appointment,
            patientInfo: patient,
          };
        })
      );
      const beingTreatedWithPatientAndDoctorInfo = await Promise.all(
        beingTreatedWithPatientInfo.map(async (appointment) => {
          const response = await axios.get(
            `http://localhost:2001/doctors/${appointment.license}`
          );
          const doctor = response.data.data;
          return {
            ...appointment,
            doctorInfo: doctor,
          };
        })
      );
      setBeingTreatedRender(beingTreatedWithPatientAndDoctorInfo);
    } catch (error) {
      console.error("Error fetching being treated appointments:", error);
    }
  };

  const handleSearch = (e) => {
    const searchText = e.target.value;
    setSearchBox(searchText);
    const filteredAppointments = listAppointments.filter(
      (appointment) =>
        appointment.id.includes(searchText) ||
        appointment.patientInfo.firstName.includes(searchText) ||
        appointment.patientInfo.surName.includes(searchText) ||
        appointment.time.includes(searchText) ||
        appointment.doctorInfo.name.includes(searchText)
    );
    setListAppointments(filteredAppointments);
  };

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
      `}
    >
      <div
        css={css`
          display: flex;
          gap: 1rem;
        `}
      >
        <FloatingLabel
          controlId="floatingInput"
          label="Search"
          css={css`
            flex: 2;
          `}
        >
          <Form.Control type="text" onChange={handleSearch} value={searchBox} />
        </FloatingLabel>
        <FloatingLabel
          css={css`
            flex: 3;
          `}
          label="Check in date"
        >
          <Form.Control type="text" value={checkInDate} disabled readOnly />
        </FloatingLabel>
        <Button
          css={css`
            flex: 1;
          `}
          onClick={() => {
            fetchAppointmentsToday();
          }}
        >
          Refresh
        </Button>
      </div>

      <div
        css={css`
          display: ${listAppointments.length === 0 &&
          beingTreatedRender.length === 0
            ? "none"
            : "flex"};
          flex-direction: row;
          /* display: flex; */
          gap: 1rem;
          border: solid black 1px;
          padding: 1rem;
          border-radius: 10px;
        `}
      >
        <ConfirmAppointments
          isComfirmpatient={isComfirmpatient}
          listAppointments={listAppointments}
          fetchAppointmentsToday={fetchAppointmentsToday}
          fetchBeingTreated={fetchBeingTreated}
        />
        <BeingTreated
          beingTreatedRender={beingTreatedRender}
          setSearchPatients={setSearchPatients}
          setActiveTab={setActiveTab}
          fetchBeingTreated={fetchBeingTreated}
        />
      </div>
    </div>
  );
}

export default CheckIn;
