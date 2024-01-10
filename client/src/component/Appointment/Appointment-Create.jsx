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

function AppointmentCreate({ searchPatients, setSearchPatients }) {
  const [inputPatientHN, setInputPatientHN] = useState("");
  const [inputPatientName, setInputPatientName] = useState("");
  const [inputPatientCardID, setInputPatientCardID] = useState("");
  const [showButtonPatient, setshowButtonPatient] = useState(false);
  const [showButtonDoctor, setshowButtonDoctor] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("09");
  const [searchDoctors, setSearchDoctors] = useState([]);
  const [newAppointmentId, setNewAppointmentId] = useState("");

  const params = useParams();

  //patients section

  const setPatientOtherComponent = () => {
    setSearchPatients();
  };

  const getPatients = async () => {
    try {
      const response = await axios.get("http://localhost:2001/patients");
      return response.data.data;
    } catch (error) {
      alert("Fetching error");
    }
  };

  const findPatients = (patients) => {
    const resultFilter = patients.filter(
      (patient) =>
        patient.HN === inputPatientHN ||
        patient.firstName === inputPatientName ||
        patient.idCard === inputPatientCardID
    );
    return resultFilter;
  };

  const handleSearchPatients = async (event) => {
    event.preventDefault();
    const patients = await getPatients();
    const requestedData = findPatients(patients);
    if (requestedData.length > 0) {
      setSearchPatients([...requestedData]);
      setshowButtonPatient(true);
    } else {
      alert("Patient not found");
      setSearchPatients([...requestedData]);
    }
  };

  const handleConfirmPatient = (confirmHN) => {
    const result = searchPatients.filter((patient) => {
      return patient.HN === confirmHN;
    });
    setSearchPatients([...result]);
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

  const getAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:2001/appointments/");

      return response.data.data;
    } catch {
      alert("fetching appointment error");
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
          <h4>Search patient</h4>
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
            <FloatingLabel
              css={css`
                flex: 2;
              `}
              label="Patient name"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setInputPatientName(e.target.value);
                }}
                value={inputPatientName}
              />
            </FloatingLabel>
            <FloatingLabel
              css={css`
                flex: 2;
              `}
              label="Patient ID Card"
              onChange={(e) => {
                setInputPatientCardID(e.target.value);
              }}
              value={inputPatientCardID}
            >
              <Form.Control type="text" />
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

          {searchPatients &&
            Array.isArray(searchPatients) &&
            searchPatients.map((patient) => {
              return (
                <div
                  key={patient.HN}
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
                  <img src={patient.picture}></img>
                  <div
                    css={css`
                      display: flex;
                      flex-direction: column;
                      gap: 1rem;
                    `}
                  >
                    <FloatingLabel label="Patient Name">
                      <Form.Control
                        type="text"
                        value={`${patient.firstName} ${patient.surName}`}
                        disabled
                        readOnly
                      />
                    </FloatingLabel>
                    <FloatingLabel label="HN">
                      <Form.Control
                        type="text"
                        value={patient.HN}
                        disabled
                        readOnly
                      />
                    </FloatingLabel>
                    <Button
                      onClick={() => {
                        handleConfirmPatient(patient.HN);
                      }}
                      css={css`
                        display: ${showButtonPatient ? "block" : "none"};
                      `}
                    >
                      Confirm Patient
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
          <h4>Fill in appointment</h4>
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
                defaultValueValue={selectedTime}
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
