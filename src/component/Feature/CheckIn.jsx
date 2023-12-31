import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import { patients } from "../../data/patients";
import { useState, useEffect } from "react";

function CheckIn() {
  const checkInDate = new Date();
  const [inputPatientId, setInputPatientId] = useState("");
  const [checkInPatient, setCheckInPatient] = useState({});
  const [showDetail, setShowDetail] = useState(false);

  const getPatients = async () => {
    try {
      const resultFetching = await patients();
      const resultFilter = resultFetching.find((patient) => {
        return patient.id === inputPatientId;
      });
      if (resultFilter) {
        //if resultFilter not empty return true
        setCheckInPatient(resultFilter);
        setShowDetail(true);
      } else alert("not found");
    } catch (error) {
      alert("fetching error");
    }
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
          label="Patient id"
          css={css`
            flex: 2;
          `}
        >
          <Form.Control
            type="text"
            onChange={(e) => {
              setInputPatientId(e.target.value);
            }}
            value={inputPatientId}
          />
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
            getPatients();
          }}
        >
          Check In
        </Button>
      </div>
      {/* display detail after click checkIn */}
      <div
        css={css`
          display: flex;
          gap: 1rem;
          display: ${showDetail ? "flex" : "none"};
        `}
      >
        <img
          src={checkInPatient.picture}
          css={css`
            flex: 1;
            aspect-ratio: 1/1;
          `}
        ></img>
        <div
          css={css`
            flex: 3;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          `}
        >
          <FloatingLabel
            css={css`
              width: fit-content;
            `}
            label="Patient Name"
          >
            <Form.Control
              type="text"
              value={`${checkInPatient.firstName} ${checkInPatient.surName}`}
              disabled
              readOnly
            />
          </FloatingLabel>
          <FloatingLabel
            css={css`
              width: fit-content;
            `}
            label="Course Remaining"
          >
            <Form.Control
              type="text"
              value={checkInPatient.courseRemaining}
              disabled
              readOnly
            />
          </FloatingLabel>
          <Button
            css={css`
              width: fit-content;
            `}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CheckIn;
