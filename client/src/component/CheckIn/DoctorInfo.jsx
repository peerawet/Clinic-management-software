import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
function DoctorInfo({ selectedAppointment }) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        gap: 1rem;
      `}
    >
      <img
        css={css`
          width: 50%;
        `}
        src={selectedAppointment.doctorInfo.picture}
      ></img>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 50%;
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
            value={selectedAppointment.doctorInfo.name}
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
            value={selectedAppointment.doctorInfo._id}
            disabled
            readOnly
          />
        </FloatingLabel>
      </div>
    </div>
  );
}
export default DoctorInfo;
