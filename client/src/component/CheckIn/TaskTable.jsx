import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import axios from "axios";
import Table from "react-bootstrap/Table";
import { useState } from "react";
import PopUp from "./PopUp";

import ProgressBar from "react-bootstrap/ProgressBar";

function TaskTable({
  listAppointments,
  fetchAppointments,
  selectDate,
  setActiveTab,
  setSearchPatients,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState({});
  const [patientCourses, setPatientCourses] = useState([]);

  const handleShowModal = async (appointment) => {
    if (appointment.status === "booked" || appointment.status === "check in") {
      try {
        const response = await axios.get("http://localhost:2001/treatments");
        const treatments = response.data.data;

        const updatedTreatmentInfo = treatments.map((treatment) => ({
          ...treatment,
          isSelected: false,
        }));

        const updatedAppointment = {
          ...appointment,
          treatmentInfo: updatedTreatmentInfo,
        };

        setSelectedAppointment(updatedAppointment);
        console.log(updatedAppointment);
        setShowModal(true);
      } catch (error) {
        console.error("Error fetching treatments", error);
      }
    } else {
      const receiptsResponse = await axios.get(
        `http://localhost:2001/receipts/appointment/${appointment._id}`
      );
      const receipts = receiptsResponse.data.data;

      const receiptsTreatmentsResponse = await axios.get(
        `http://localhost:2001/receipts_treatments/receipt/${receipts[0]._id}`
      );
      const receiptsTreatments = receiptsTreatmentsResponse.data.data;
      const paidTreatmentIds = receiptsTreatments.map(
        (treatmentId) => treatmentId.treatment_id
      );

      const treatmentsResponse = await axios.get(
        "http://localhost:2001/treatments"
      );
      const treatments = treatmentsResponse.data.data;

      const updatedTreatmentInfo = treatments.map((treatment) => ({
        ...treatment,
        isSelected: paidTreatmentIds.includes(treatment._id),
      }));

      const updatedAppointment = {
        ...appointment,
        treatmentInfo: updatedTreatmentInfo,
      };

      setSelectedAppointment(updatedAppointment);
      setShowModal(true);
    }
    getCoursesOfPatient(appointment);
  };

  const getCoursesOfPatient = async (appointment) => {
    try {
      const response = await axios.get(
        `http://localhost:2001/courses_patients/course-info/${appointment.patientInfo._id}`
      );

      const coursesUpdate = response.data.data;
      setPatientCourses(coursesUpdate);
    } catch (error) {
      console.error("Error fetching courses for the patient", error);
    }
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
    <>
      {listAppointments.length > 0 && (
        <>
          {" "}
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
                              onClick={() =>
                                handleShowModal(matchingAppointment)
                              }
                            >
                              {matchingAppointment.patientInfo.name}/
                              {matchingAppointment.HN}
                              {matchingAppointment.status === "booked" && (
                                <ProgressBar variant="danger" now={0} />
                              )}
                              {matchingAppointment.status === "check in" && (
                                <ProgressBar variant="danger" now={20} />
                              )}
                              {matchingAppointment.status === "paid" && (
                                <ProgressBar variant="warning" now={40} />
                              )}
                              {matchingAppointment.status ===
                                "being treated" && (
                                <ProgressBar variant="info" now={60} />
                              )}
                              {matchingAppointment.status === "completed" && (
                                <ProgressBar variant="success" now={100} />
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
          <PopUp
            selectedAppointment={selectedAppointment}
            setSelectedAppointment={setSelectedAppointment}
            showModal={showModal}
            setShowModal={setShowModal}
            fetchAppointments={fetchAppointments}
            handleShowModal={handleShowModal}
            setActiveTab={setActiveTab}
            setSearchPatients={setSearchPatients}
            patientCourses={patientCourses}
          />
        </>
      )}
      {listAppointments.length === 0 && <div>no appointments on this day</div>}
    </>
  );
}

export default TaskTable;
