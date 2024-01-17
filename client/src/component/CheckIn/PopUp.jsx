import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import Treatment from "./Treatment";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

function PopUp({
  selectedAppointment,
  setSelectedAppointment,
  showModal,
  setShowModal,
}) {
  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setShowModal(false);
  };
  return (
    <>
      {selectedAppointment && (
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Appointment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>ID: {selectedAppointment._id}</p>
            <p>HN: {selectedAppointment.HN}</p>
            <Treatment />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary">Understood</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default PopUp;
