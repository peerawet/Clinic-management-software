import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import axios from "axios";
import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";

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
    fetchBeingtreatedToday();
  }, [activeTab]);

  const fetchBeingtreatedToday = async () => {
    const beingTreatedToday = await axios.get(
      "http://localhost:2001/beingtreated"
    );
    console.log(beingTreatedToday);
    setBeingTreatedRender(beingTreatedToday.data.data);
  };

  const getAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:2001/appointments");
      const appintments = response.data.data;

      return appintments;
    } catch (error) {
      alert("Fetching appintments error");
    }
  };

  const fetchAppointmentsToday = async () => {
    const appointments = await getAppointments();
    const appointmentsToday = findAppointmentsToday(appointments);
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

  function getCurrentDate() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var formattedDay = day < 10 ? "0" + day : day.toString();
    var formattedMonth = month < 10 ? "0" + month : month.toString();
    var formattedDate = {
      day: formattedDay,
      month: formattedMonth,
      year: year.toString(),
    };
    return formattedDate;
  }

  const findAppointmentsToday = (appointments) => {
    const currentDate = getCurrentDate();
    const resultFilter = appointments.filter((appointment) => {
      return (
        appointment.status === "booked" &&
        appointment.day === currentDate.day &&
        appointment.month === currentDate.month &&
        appointment.year === currentDate.year
      );
    });

    return resultFilter;
  };

  const handleCheckIn = async (appointment) => {
    await axios.post("http://localhost:2001/beingtreated", {
      ...appointment,
      status: "being treated",
    });

    const render = await axios.get("http://localhost:2001/beingtreated");
    const appointmentWithoutPatientAndDoctor = { ...appointment };
    delete appointmentWithoutPatientAndDoctor.patientInfo;
    delete appointmentWithoutPatientAndDoctor.doctorInfo;
    await axios.put(`http://localhost:2001/appointments/${appointment.id}`, {
      ...appointmentWithoutPatientAndDoctor,
      status: "being treated",
    });
    setBeingTreatedRender(render.data.data);

    await fetchAppointmentsToday();
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
    const patientToAppointment = await getPatientById(HN);
    console.log(patientToAppointment);
    const patientToAppointmentArray = [{ ...patientToAppointment.data.data }];
    setSearchPatients(patientToAppointmentArray);
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
                  <Accordion.Header>{`Patient name : ${appointment.patientInfo.firstName} ${appointment.patientInfo.surName}`}</Accordion.Header>
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
                            value={appointment.patientInfo.HN}
                            disabled
                            readOnly
                          />
                        </FloatingLabel>

                        <FloatingLabel label="Patient name">
                          <Form.Control
                            type="text"
                            value={`${appointment.patientInfo.firstName} ${appointment.patientInfo.surName}`}
                            disabled
                            readOnly
                          />
                        </FloatingLabel>
                        <FloatingLabel label="Course remaining">
                          <Form.Control
                            type="text"
                            value={appointment.patientInfo.courseRemaining}
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
                            value={appointment.doctorInfo.license}
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
                  value={appointment.id}
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
                    value={`Date : ${appointment.day}-${appointment.month}-${appointment.year}`}
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
                    value={`time : ${appointment.time}.00-${String(
                      Number(appointment.time) + 1
                    )}.00`}
                    disabled
                    readOnly
                  />
                </FloatingLabel>
              </div>

              <Button
                css={css`
                  width: 100%;
                  display: ${isComfirmpatient ? "none" : "block"};
                `}
                onClick={() => handleCheckIn(appointment)}
              >
                Confirm
              </Button>
            </div>
          ))}
        </div>
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
                    handleAppointmentAndCheckOut(
                      beingTreated.HN,
                      beingTreated.id
                    );
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
      </div>
    </div>
  );
}

export default CheckIn;
