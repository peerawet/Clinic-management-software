import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import Treatment from "./Treatment";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import { useState } from "react";
import Receipt from "./Receipt";
import { useEffect } from "react";
import axios from "axios";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import PatientInfo from "./PatientInfo";
import DoctorInfo from "./DoctorInfo";

function PopUp({
  selectedAppointment,
  setSelectedAppointment,
  showModal,
  setShowModal,
  fetchAppointments,
  handleShowModal,
  setActiveTab,
  setSearchPatients,
  patientCourses,
}) {
  const [treatments, setTreatments] = useState([]);
  useEffect(() => {
    fetchTreatments();
  }, [selectedAppointment]);
  const fetchTreatments = async () => {
    try {
      const response = await axios.get("http://localhost:2001/treatments");
      setTreatments(response.data.data);
    } catch (error) {
      console.error("Error fetching treatments", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCheckIn = async () => {
    try {
      // Update appointment status to "check in"
      const updatedAppointment = {
        ...selectedAppointment,
        status: "check in",
        checkIn: new Date(),
      };
      await handleShowModal(updatedAppointment);

      delete updatedAppointment.patientInfo;
      delete updatedAppointment.doctorInfo;
      delete updatedAppointment.treatmentInfo;
      await axios.put(
        `http://localhost:2001/appointments/${updatedAppointment._id}`,
        updatedAppointment
      );

      await fetchAppointments();
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const handleTreat = async () => {
    try {
      // Update appointment status to "being treated"
      const updatedAppointment = {
        ...selectedAppointment,
        status: "being treated",
      };
      await handleShowModal(updatedAppointment);

      delete updatedAppointment.patientInfo;
      delete updatedAppointment.doctorInfo;
      delete updatedAppointment.treatmentInfo;
      await axios.put(
        `http://localhost:2001/appointments/${updatedAppointment._id}`,
        updatedAppointment
      );

      await fetchAppointments();
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const handleCheckOut = async () => {
    try {
      // Update appointment status to "completed"
      const updatedAppointment = {
        ...selectedAppointment,
        status: "completed",
        checkOut: new Date(),
      };
      await handleShowModal(updatedAppointment);

      delete updatedAppointment.patientInfo;
      delete updatedAppointment.doctorInfo;
      delete updatedAppointment.treatmentInfo;
      await axios.put(
        `http://localhost:2001/appointments/${updatedAppointment._id}`,
        updatedAppointment
      );

      await fetchAppointments();
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const handleAddNewAppointmentAndCheckOut = async () => {
    setSearchPatients([selectedAppointment.patientInfo]);
    await handleCheckOut();
    handleCloseModal();
    setActiveTab("Appointment");
  };

  return (
    <>
      {selectedAppointment && (
        <Modal show={showModal} onHide={handleCloseModal} keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedAppointment._id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 1rem;
              `}
            >
              <Accordion defaultActiveKey="2" alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Patient Info</Accordion.Header>
                  <Accordion.Body>
                    <PatientInfo selectedAppointment={selectedAppointment} />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Doctor Info</Accordion.Header>
                  <Accordion.Body>
                    <DoctorInfo selectedAppointment={selectedAppointment} />
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              {selectedAppointment.status === "check in" && (
                <Treatment
                  setSelectedAppointment={setSelectedAppointment}
                  treatments={treatments}
                  selectedAppointment={selectedAppointment}
                  patientCourses={patientCourses}
                />
              )}

              <Receipt
                selectedAppointment={selectedAppointment}
                setSelectedAppointment={setSelectedAppointment}
                treatments={treatments}
                fetchAppointments={fetchAppointments}
                handleShowModal={handleShowModal}
                patientCourses={patientCourses}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            {selectedAppointment.status === "booked" && (
              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                  gap: 1rem;
                  width: 100%;
                `}
              >
                <FloatingLabel
                  label="Check in date"
                  css={css`
                    width: 100%;
                  `}
                >
                  <Form.Control
                    type="text"
                    value={new Date()}
                    disabled
                    readOnly
                  />
                </FloatingLabel>
                <Button
                  css={css`
                    width: 100%;
                  `}
                  onClick={handleCheckIn}
                >
                  Check In
                </Button>
              </div>
            )}
            {selectedAppointment.status === "paid" && (
              <Button
                variant="primary"
                onClick={handleTreat}
                css={css`
                  width: 100%;
                `}
              >
                Start Treating!!
              </Button>
            )}
            {selectedAppointment.status === "being treated" && (
              <>
                <Button
                  css={css`
                    flex: 1;
                  `}
                  onClick={handleCheckOut}
                >
                  Check out
                </Button>
                <Button
                  css={css`
                    flex: 1;
                  `}
                  onClick={handleAddNewAppointmentAndCheckOut}
                >
                  Appointment & Check out
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default PopUp;
