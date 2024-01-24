import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useState } from "react";

function InputPupUp({ show, setShow, selectedCourse, inputHn, setInputHn }) {
  const [selectedPatient, setSelectedPatient] = useState({});
  const handleBuy = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:2001/patients/${inputHn}`
      );

      if (response.status === 404) {
        alert("Patient not found");
      } else {
        setSelectedPatient(response.data.data);

        const patient_id = inputHn;
        const course_id = selectedCourse._id;
        const remaining = selectedCourse.total;

        await axios.post(`http://localhost:2001/courses_patients/`, {
          patient_id: patient_id,
          course_id: course_id,
          remaining: remaining,
        });
        alert(`${inputHn} has bought successfully`);
        setInputHn("");
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      alert("An error occurred while fetching patient data");
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Card className="bg-dark text-white">
        <Card.Img
          src={selectedCourse.picture}
          alt="Card image"
          css={css`
            filter: blur(5px);
            aspect-ratio: 1;
          `}
        />
        <Card.ImgOverlay
          css={css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 2rem;
          `}
        >
          <Card.Title>
            <h3>{selectedCourse.name}</h3>
          </Card.Title>

          <Form onSubmit={handleBuy}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Patient HN</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                onChange={(e) => setInputHn(e.target.value)}
                value={inputHn}
              />
            </Form.Group>
            <Button
              type="submit"
              css={css`
                width: 40%;
              `}
            >
              Buy now
            </Button>
          </Form>
        </Card.ImgOverlay>
      </Card>
    </Modal>
  );
}

export default InputPupUp;
