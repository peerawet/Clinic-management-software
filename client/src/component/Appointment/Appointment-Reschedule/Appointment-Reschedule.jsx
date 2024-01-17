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

function AppointmentReschule() {
  const [inputPatientHN, setInputPatientHN] = useState("");
  const [searchAppointments, setSearchAppointment] = useState([]);
  const [showButtonPatient, setshowButtonPatient] = useState(false);
  const [showButtonDoctor, setshowButtonDoctor] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("09");
  const [searchDoctors, setSearchDoctors] = useState([]);
  const [newAppointmentId, setNewAppointmentId] = useState("");

  const params = useParams();

  //appointments section

  const getAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:2001/appointments");
      const appintments = response.data.data;
      console.log(appintments);
      return appintments;
    } catch (error) {
      alert("Fetching appintments error");
    }
  };

  const findAppointments = (appintments) => {
    const specifyAppointments = appintments.filter(
      (appointment) =>
        appointment.HN === inputPatientHN && appointment.status === "booked"
    );

    return specifyAppointments;
  };

  const handlesearchAppointments = async (event) => {
    event.preventDefault();
    const appintments = await getAppointments();
    const specifyAppointments = findAppointments(appintments);
    if (specifyAppointments.length > 0) {
      setSearchAppointment(specifyAppointments);

      setshowButtonPatient(true);
    } else {
      alert("Specify Appointments not found");
    }
  };

  const handleConfirmPatient = (confirmAppointmentsId) => {
    const confirmPatient = searchAppointments.filter((appointment) => {
      return appointment.id === confirmAppointmentsId;
    });
    setSearchAppointment(confirmPatient);
    setshowButtonPatient(false);
  };

  //doctors section

  const getDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:2001/doctors");
      return response.data.data;
    } catch (error) {
      alert("Fetching error");
    }
  };

  const handleConfirmDoctor = (confirmlisence) => {
    const result = searchDoctors.filter((doctor) => {
      return doctor.license === confirmlisence;
    });
    setSearchDoctors([...result]);
    setshowButtonDoctor(false);
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

  const findAvailableDoctors = async (appointments) => {
    const dateObject = formatDate();
    const time = selectedTime;

    const unAvailableDoctors = appointments
      .filter(
        (appointment) =>
          appointment.year === dateObject.year &&
          appointment.month === dateObject.month &&
          appointment.day === dateObject.day &&
          appointment.time === time
      )
      .map((appointment) => appointment.license);
    console.log(unAvailableDoctors);
    // Fetch all doctors
    const doctors = await getDoctors();

    // Filter available doctors based on unAvailableDoctors array
    const availableDoctors = doctors.filter(
      (doctor) => !unAvailableDoctors.includes(doctor.license)
    );
    const availibleDoctorsInSpecificBranch = availableDoctors.filter(
      (doctor) => doctor.branch === params.id.toLocaleUpperCase()
    );
    return availibleDoctorsInSpecificBranch;
  };

  const handleSearchDoctor = async (event) => {
    event.preventDefault();
    const appointments = await getAppointments();
    const availableDoctors = await findAvailableDoctors(appointments);

    if (availableDoctors.length > 0) {
      setSearchDoctors([...availableDoctors]);
      setshowButtonDoctor(true);
    } else {
      alert("No available doctors found.");
      setSearchDoctors([...availableDoctors]);
    }
  };

  //reschedule appointment section

  const handleReschedule = async () => {
    if (
      searchAppointments.length === 1 &&
      searchDoctors.length === 1 &&
      showButtonDoctor === false &&
      showButtonPatient === false
    ) {
      try {
        const appointmentId = await createAppointmentIdAndPut();
        setNewAppointmentId(appointmentId);
      } catch (error) {
        alert(`Error Reschedule appointment: ${error.message}`);
      }
    } else {
      alert("Please fill out the information completely.");
    }
  };

  const createAppointmentIdAndPut = async () => {
    const dateObject = formatDate();
    const time = selectedTime;
    const appointment = searchAppointments[0];
    const doctor = searchDoctors[0];
    const branch = params.id.toLocaleUpperCase();
    const oldAppointmentId = appointment.id;
    const newAppointmentId = `APPT-${branch}-${dateObject.day}-${dateObject.month}-${dateObject.year}-${time}-${doctor.license}-${appointment.HN}`;
    try {
      await axios.put(
        `http://localhost:2001/appointments/${oldAppointmentId}`,
        {
          id: `APPT-${branch}-${dateObject.day}-${dateObject.month}-${dateObject.year}-${time}-${doctor.license}-${appointment.HN}`,
          day: dateObject.day,
          month: dateObject.month,
          year: dateObject.year,
          time: time,
          HN: appointment.HN,
          license: doctor.license,
          status: "booked",
          branch: params.id.toLocaleUpperCase(),
        }
      );
      alert("Appointment has been Reschedule");
      return newAppointmentId;
    } catch (error) {
      alert("Appointment is a duplicate date");
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
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 1rem;
            border: solid gray 1px;
            border-radius: 10px;
            padding: 1rem;
            flex: 1;
            height: fit-content;
          `}
        >
          <h4>Patient</h4>
          <Form
            css={css`
              display: flex;
              flex-direction: column;
              gap: 1rem;
            `}
            onSubmit={handlesearchAppointments}
          >
            <FloatingLabel
              controlId="floatingInput"
              label="HN"
              css={css`
                flex: 2;
              `}
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setInputPatientHN(e.target.value);
                }}
                value={inputPatientHN}
              />
            </FloatingLabel>

            <Button
              css={css`
                flex: 1;
              `}
              type="submit"
            >
              Search
            </Button>
          </Form>

          {searchAppointments.map((appointment, index) => {
            return (
              <div
                key={index}
                css={css`
                  display: flex;
                  flex-direction: column;
                  gap: 1rem;
                  border: solid gray 1px;
                  border-radius: 10px;
                  justify-content: center;
                  align-items: center;
                  padding: 1rem;
                  width: 100%;
                `}
              >
                <div
                  css={css`
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    gap: 1rem;
                  `}
                >
                  <FloatingLabel label="Appointment ID">
                    <Form.Control
                      type="text"
                      value={appointment.id}
                      disabled
                      readOnly
                    />
                  </FloatingLabel>

                  <FloatingLabel label="date & time">
                    <Form.Control
                      type="text"
                      value={`Date : ${appointment.day}/${appointment.month}/${
                        appointment.year
                      }   Time : ${appointment.time}.00-${String(
                        Number(appointment.time) + 1
                      )}.00`}
                      disabled
                      readOnly
                    />
                  </FloatingLabel>
                  <Button
                    onClick={() => {
                      handleConfirmPatient(appointment.id);
                    }}
                    css={css`
                      display: ${showButtonPatient ? "block" : "none"};
                    `}
                  >
                    Select
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        {/* doctor section */}
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 1rem;
            border: solid gray 1px;
            border-radius: 10px;
            padding: 1rem;
            flex: 1;
          `}
        >
          <h4>Fill in Reschedule</h4>
          <Form
            css={css`
              display: flex;
              flex-direction: column;
              gap: 1rem;
            `}
            onSubmit={handleSearchDoctor}
          >
            <FloatingLabel
              css={css`
                flex: 1;
              `}
              label="Branch"
            >
              <Form.Control
                type="text"
                value={params.id.toLocaleUpperCase()}
                disabled
              />
            </FloatingLabel>
            <div>
              <h6>Pick date</h6>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
                isClearable
                placeholderText="Select a date"
              />
            </div>
            <div>
              <h6>Pick time</h6>
              <Form.Select
                onChange={(e) => {
                  setSelectedTime(e.target.value);
                  console.log(selectedTime);
                }}
                defaultValue={selectedTime}
              >
                <option value="09">9.00-10.00</option>
                <option value="10">10.00-11.00</option>
                <option value="11">11.00-12.00</option>
                <option value="12">12.00-13.00</option>
                <option value="13">13.00-14.00</option>
                <option value="14">14.00-15.00</option>
                <option value="15">15.00-16.00</option>
                <option value="16">16.00-17.00</option>
                <option value="17">17.00-18.00</option>
              </Form.Select>
            </div>

            <Button
              css={css`
                flex: 1;
              `}
              type="submit"
            >
              Search available physical therapist
            </Button>
          </Form>

          {searchDoctors.map((doctor) => {
            return (
              <div
                key={doctor.license}
                css={css`
                  display: flex;
                  flex-direction: row;
                  gap: 1rem;
                  border: solid gray 1px;
                  border-radius: 10px;
                  justify-content: center;
                  align-items: center;
                  padding: 1rem;
                  width: fit-content;
                `}
              >
                <img
                  src={doctor.picture}
                  css={css`
                    width: 13rem;
                  `}
                ></img>
                <div
                  css={css`
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    flex: 1;
                  `}
                >
                  <FloatingLabel label="Physical therapist name">
                    <Form.Control
                      type="text"
                      value={doctor.name}
                      disabled
                      readOnly
                    />
                  </FloatingLabel>
                  <FloatingLabel label="License">
                    <Form.Control
                      type="text"
                      value={doctor.license}
                      disabled
                      readOnly
                    />
                  </FloatingLabel>
                  <Button
                    onClick={() => {
                      handleConfirmDoctor(doctor.license);
                    }}
                    css={css`
                      display: ${showButtonDoctor ? "block" : "none"};
                    `}
                  >
                    Confirm Doctor
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        css={css`
          display: flex;
        `}
      >
        <Button
          onClick={handleReschedule}
          css={css`
            width: 50%;
          `}
        >
          Reschedule
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

export default AppointmentReschule;
