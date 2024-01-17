import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import axios from "axios";
import { useState } from "react";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";

function SearchPatient({
  searchPatients,
  setSearchPatients,
  showButtonPatient,
  setShowButtonPatient,
}) {
  const [inputPatientHN, setInputPatientHN] = useState("");

  const handleSearchPatients = async (event) => {
    event.preventDefault();

    const patientId = inputPatientHN;

    const foundPatient = await axios.get(
      `http://localhost:2001/patients/${patientId}`
    );
    console.log(`http://localhost:2001/patients/${patientId}`);
    if (foundPatient) {
      setSearchPatients([foundPatient.data.data]);
      setShowButtonPatient(true);
    } else {
      alert("Patient not found");
      setSearchPatients([]);
      setShowButtonPatient(false);
    }
  };

  const handleConfirmPatient = () => {
    setShowButtonPatient(false);
  };

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
        border: solid gray 1px;
        border-radius: 10px;
        padding: 1rem;
        flex: 1;
      `}
    >
      <h4>Search patient</h4>
      <Form
        css={css`
          display: flex;
          flex-direction: column;
          gap: 1rem;
        `}
        onSubmit={handleSearchPatients}
      >
        <FloatingLabel
          controlId="floatingInput"
          label="HN"
          css={css`
            flex: 2;
          `}
        >
          <Form.Control
            type="text"
            onChange={(e) => {
              setInputPatientHN(e.target.value);
            }}
            value={inputPatientHN}
          />
        </FloatingLabel>

        <Button
          css={css`
            flex: 1;
          `}
          type="submit"
        >
          Search
        </Button>
      </Form>

      {searchPatients ? (
        searchPatients.map((patient) => (
          <div
            key={patient._id}
            css={css`
              display: flex;
              flex-direction: row;
              gap: 1rem;
              border: solid gray 1px;
              border-radius: 10px;
              justify-content: center;
              align-items: center;
              padding: 1rem;
              width: fit-content;
            `}
          >
            {patient.picture && <img src={patient.picture} alt="Patient" />}
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 1rem;
              `}
            >
              <FloatingLabel label="Patient Name">
                <Form.Control
                  type="text"
                  value={patient.name}
                  disabled
                  readOnly
                />
              </FloatingLabel>
              <FloatingLabel label="HN">
                <Form.Control
                  type="text"
                  value={patient._id}
                  disabled
                  readOnly
                />
              </FloatingLabel>
              <Button
                onClick={() => {
                  handleConfirmPatient();
                }}
                css={css`
                  display: ${showButtonPatient ? "block" : "none"};
                `}
              >
                Confirm Patient
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p>No patients to display</p>
      )}
    </div>
  );
}

export default SearchPatient;
