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
  const [inputPatientName, setInputPatientName] = useState("");
  const [inputPatientCardID, setInputPatientCardID] = useState("");

  const findPatients = (patients) => {
    const resultFilter = patients.filter(
      (patient) =>
        patient.HN === inputPatientHN ||
        patient.firstName === inputPatientName ||
        patient.idCard === inputPatientCardID
    );
    return resultFilter;
  };

  const handleSearchPatients = async (event) => {
    event.preventDefault();
    const response = await axios.get("http://localhost:2001/patients");
    const patients = response.data.data;
    const requestedData = findPatients(patients);
    if (requestedData.length > 0) {
      setSearchPatients(requestedData);
      setShowButtonPatient(true);
    } else {
      alert("Patient not found");
      setSearchPatients([...requestedData]);
    }
  };

  const handleConfirmPatient = (confirmHN) => {
    const result = searchPatients.filter((patient) => {
      return patient.HN === confirmHN;
    });
    setSearchPatients([...result]);
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
        <FloatingLabel
          css={css`
            flex: 2;
          `}
          label="Patient name"
        >
          <Form.Control
            type="text"
            onChange={(e) => {
              setInputPatientName(e.target.value);
            }}
            value={inputPatientName}
          />
        </FloatingLabel>
        <FloatingLabel
          css={css`
            flex: 2;
          `}
          label="Patient ID Card"
          onChange={(e) => {
            setInputPatientCardID(e.target.value);
          }}
          value={inputPatientCardID}
        >
          <Form.Control type="text" />
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
            key={patient.HN}
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
                  value={`${patient.firstName} ${patient.surName}`}
                  disabled
                  readOnly
                />
              </FloatingLabel>
              <FloatingLabel label="HN">
                <Form.Control
                  type="text"
                  value={patient.HN}
                  disabled
                  readOnly
                />
              </FloatingLabel>
              <Button
                onClick={() => {
                  handleConfirmPatient(patient.HN);
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
