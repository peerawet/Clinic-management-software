import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import axios from "axios";

function NewAppointment({ setShow, show, selectedAdd, fetchAppointments }) {
  const params = useParams();
  const [inputHn, setInputHn] = useState("");
  const handleClose = () => {
    setShow(false);
    setInputHn(""); // Reset the input field
  };
  const handleShow = () => setShow(true);

  const handleAddAppointment = async () => {
    try {
      console.log(selectedAdd);
      console.log();
      const doctorId = selectedAdd.id;
      const patient = inputHn;
      const startDate = new Date(selectedAdd.date);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      console.log(doctorId);
      console.log("test");
      const response = await axios.post(
        `http://localhost:2001/appointments/${params.id}/${doctorId}`,
        {
          start: startDate,
          end: endDate,
          HN: patient,
          license: doctorId,
          status: "booked",
          branch: params.id.toUpperCase(),
        }
      );
      fetchAppointments();
      handleClose();
    } catch (error) {
      console.error("Error adding appointment:", error);
      // Handle the error as per your application's requirements
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingInput" label="Patient HN">
            <Form.Control
              type="text" // Change type to "text"
              value={inputHn}
              onChange={(e) => setInputHn(e.target.value)}
            />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddAppointment}>
            Add appointment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default NewAppointment;
