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
  const [searchPatients, setSearchPatients] = useState([]);
  const [showButtonPatient, setshowButtonPatient] = useState(false);
  const [showButtonDoctor, setshowButtonDoctor] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [searchDoctors, setSearchDoctors] = useState([]);

  const params = useParams();

  //patients section

  const getSearchResources = async () => {
    try {
      const response = await axios.get("http://localhost:3001/doctors");
      const doctors = response.data.data;
      let searchResources = [];
      for (let doctor of doctors) {
        let doctorInfo = { name: doctor.name, license: doctor.license };
        for (let appointment of doctor.appointments) {
          let combinedData = { ...doctorInfo, ...appointment };
          searchResources.push(combinedData);
        }
      }
      console.log(searchResources);
      return searchResources;
    } catch (error) {
      alert("Fetching patient hn error");
    }
  };

  const findPatients = (searchResources) => {
    const resultFilter = searchResources.filter(
      (patient) => patient.patientHN === inputPatientHN
    );
    return resultFilter;
  };

  const handleSearchPatients = async (event) => {
    event.preventDefault();
    const searchResources = await getSearchResources();
    const requestedData = findPatients(searchResources);
    if (requestedData.length > 0) {
      setSearchPatients([...requestedData]);
      setshowButtonPatient(true);
    } else {
      alert("Patient not found");
    }
  };

  const handleConfirmPatient = (confirmHN) => {
    const result = searchPatients.filter((patient) => {
      return patient.patientHN === confirmHN;
    });
    setSearchPatients([...result]);
    setshowButtonPatient(false);
  };

  //doctors section

  const getDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:3001/doctors");
      return response.data.data;
    } catch (error) {
      alert("Fetching error");
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

  const findDoctors = (doctors) => {
    const dateObject = formatDate();
    const time = selectedTime;
    const filteredDoctors = doctors.filter((doctor) => {
      const hasMatchingAppointment = doctor.appointments.some(
        (appointment) =>
          appointment.year === dateObject.year &&
          appointment.month === dateObject.month &&
          appointment.day === dateObject.day &&
          appointment.time === time
      );

      return !hasMatchingAppointment;
    });
    return filteredDoctors;
  };

  const handleConfirmDoctor = (confirmlisence) => {
    const result = searchDoctors.filter((doctor) => {
      return doctor.license === confirmlisence;
    });
    setSearchDoctors([...result]);
    setshowButtonDoctor(false);
  };

  const handleSearchDoctor = async (event) => {
    event.preventDefault();
    const doctors = await getDoctors();
    const requestedData = findDoctors(doctors);
    if (requestedData.length > 0) {
      setSearchDoctors([...requestedData]);
      setshowButtonDoctor(true);
    } else {
      alert("No available doctors found.");
    }
  };

  //reschedule appointment section

  const handleReschedule = async () => {
    if (
      searchPatients.length === 1 &&
      searchDoctors.length === 1 &&
      showButtonDoctor === false &&
      showButtonPatient === false
    ) {
      try {
        const dateObject = formatDate();

        const time = selectedTime;
        const patient = searchPatients;
        const doctor = searchDoctors;

        const newAppointment = {
          day: dateObject.day,
          month: dateObject.month,
          year: dateObject.year,
          time: time,
          patientHN: patient[0].patientHN,
          status: "booked",
        };
        await axios.put(`http://localhost:3001/doctors/${searchPatients[0].license}`, {
          ...doctor[0],
          appointments: [...doctor[0].appointments, newAppointment],
        });
        const updatedDoctor = await getDoctors();
        const displayAfterUpdate = findDoctors(updatedDoctor);
        setSearchDoctors([...displayAfterUpdate]);
        setshowButtonDoctor(true);
        console.log(updatedDoctor);
        alert("Appointment has been created");
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
            onSubmit={handleSearchPatients}
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

          {searchPatients.map((appointment) => {
            return (
              <div
                key={appointment.HN}
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
                <div
                  css={css`
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                  `}
                >
                  <FloatingLabel label="HN">
                    <Form.Control
                      type="text"
                      value={appointment.patientHN}
                      disabled
                      readOnly
                    />
                  </FloatingLabel>
                  <FloatingLabel label="Doctor name">
                    <Form.Control
                      type="text"
                      value={appointment.name}
                      disabled
                      readOnly
                    />
                  </FloatingLabel>
                  <FloatingLabel label="date">
                    <Form.Control
                      type="text"
                      value={`${appointment.day}/${appointment.month}/${appointment.year}`}
                      disabled
                      readOnly
                    />
                  </FloatingLabel>
                  <Button
                    onClick={() => {
                      handleConfirmPatient(appointment.patientHN);
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
                }}
                value={selectedTime}
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
      <Button
        onClick={handleReschedule}
        css={css`
          width: 100%;
        `}
      >
        Reschedule
      </Button>
    </>
  );
}

export default AppointmentReschule;
