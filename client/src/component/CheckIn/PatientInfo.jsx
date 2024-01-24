import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
function PatientInfo({ selectedAppointment }) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        gap: 1rem;
      `}
    >
      <img src={selectedAppointment.patientInfo.picture}></img>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 1rem;
        `}
      >
        <FloatingLabel
          label="Patient Name"
          css={css`
            width: 100%;
          `}
        >
          <Form.Control
            type="text"
            value={selectedAppointment.patientInfo.name}
            disabled
            readOnly
          />
        </FloatingLabel>
        <FloatingLabel
          label="Patient ID"
          css={css`
            width: 100%;
          `}
        >
          <Form.Control
            type="text"
            value={selectedAppointment.patientInfo._id}
            disabled
            readOnly
          />
        </FloatingLabel>
      </div>
    </div>
  );
}
export default PatientInfo;
