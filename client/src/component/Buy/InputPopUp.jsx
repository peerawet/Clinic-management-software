import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import InputGroup from "react-bootstrap/InputGroup";

function InputPupUp({ show, setShow, selectedCourse, inputHn, setInputHn }) {
  const [selectedPatient, setSelectedPatient] = useState({});
  const [inputDiscount, setInputDiscount] = useState(0);
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
        const discount = Number(inputDiscount);
        const price =
          selectedCourse.price - (selectedCourse.price * inputDiscount) / 100;

        await axios.post(`http://localhost:2001/courses_patients/`, {
          patient_id: patient_id,
          course_id: course_id,
          remaining: remaining,
          discount: discount,
          price: price,
          buyDate: new Date(),
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
      <Card className="bg-dark text-black">
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
          <div
            css={css`
              background-color: rgba(255, 255, 255, 0.5);
              width: fit-content;
            `}
          >
            <Card.Title>
              <h3>{selectedCourse.name}</h3>
            </Card.Title>
          </div>
          <Form
            onSubmit={handleBuy}
            css={css`
              display: flex;
              flex-direction: column;
              gap: 1rem;
            `}
          >
            <FloatingLabel controlId="floatingInput" label="ราคาสุทธิ">
              <Form.Control
                type="number"
                value={
                  selectedCourse.price -
                  (selectedCourse.price * inputDiscount) / 100
                }
                disabled
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput" label="Patient HN">
              <Form.Control
                type="text"
                onChange={(e) => setInputHn(e.target.value)}
                value={inputHn}
              />
            </FloatingLabel>

            <InputGroup
              className="mb-3"
              css={css`
                width: 50%;
              `}
            >
              <Form.Control
                placeholder="ส่วนลด"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                type="number"
                value={inputDiscount}
                onChange={(e) => {
                  setInputDiscount(e.target.value);
                }}
              />
              <InputGroup.Text id="basic-addon2">%</InputGroup.Text>
            </InputGroup>

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
