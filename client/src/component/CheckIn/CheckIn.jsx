import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TaskTable from "./TaskTable";
import DatePicker from "react-datepicker";

function CheckIn({ setActiveTab, setSearchPatients, activeTab }) {
  const [listAppointments, setListAppointments] = useState([]);
  const [selectDate, setSelectDate] = useState(new Date());
  const params = useParams();

  useEffect(() => {
    fetchAppointments();
  }, [activeTab, selectDate]);

  const fetchAppointments = async () => {
    const dateToFetch = selectDate.getTime();

    try {
      const response = await fetch(
        `http://localhost:2001/appointments/on-date/${dateToFetch}?branch=${params.id}`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const appointmentsJson = await response.json();
      const appointments = appointmentsJson.data;

      const appointmentsWithPatientInfo = await Promise.all(
        appointments.map(async (appointment) => {
          const patientResponse = await fetch(
            `http://localhost:2001/patients/${appointment.HN}`
          );
          const response = await patientResponse.json();
          const patient = response.data;
          return {
            ...appointment,
            patientInfo: patient,
          };
        })
      );
      const appointmentsWithPatientAndDoctorInfo = await Promise.all(
        appointmentsWithPatientInfo.map(async (appointment) => {
          const doctorResponse = await fetch(
            `http://localhost:2001/doctors/${appointment.license}`
          );
          const response = await doctorResponse.json();
          const doctor = response.data;
          return {
            ...appointment,
            doctorInfo: doctor,
          };
        })
      );

      setListAppointments(appointmentsWithPatientAndDoctorInfo);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  return (
    <>
      <DatePicker
        selected={selectDate}
        onChange={(date) => {
          setSelectDate(date);
        }}
      />
      <TaskTable
        listAppointments={listAppointments}
        selectDate={selectDate}
        fetchAppointments={fetchAppointments}
        setActiveTab={setActiveTab}
        setSearchPatients={setSearchPatients}
      />
    </>
  );
}

export default CheckIn;
