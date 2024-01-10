import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */

function NewPatient() {
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [idCard, setIdcard] = useState("");
  const [displayHN, setDisplayHN] = useState("");

  const params = useParams();

  const getPatients = async () => {
    try {
      const response = await axios.get("http://localhost:2001/patients");
      return response.data.data;
    } catch {
      alert("fetching error");
    }
  };

  const createHN = (branch, year, month, runNumber) => {
    return `${branch}${year}${month}${runNumber}`;
  };

  const getBranch = () => {
    return params.id.toUpperCase();
  };

  const getYear = () => {
    const currentDate = new Date();
    const year = `${currentDate.getFullYear()}`.slice(2, 4); //year ="24"
    return year;
  };

  const getMonth = () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; //month = 1
    const formatMonth = month + 1 > 9 ? `${month}` : `0${month}`; //month = 01
    return `${formatMonth}`;
  };

  const getRunNumber = (patients) => {
    const accessToHN = patients.map((patient) => patient.HN); //accessToHN = ["SR240101","RC240101","SR240102"]
    console.log(accessToHN);
    const hnFilterBranch = accessToHN.filter(
      (patientHN) => params.id.toUpperCase() === patientHN.slice(0, 2) // hnFilterBranchHN = ["SR240101","SR240102"] if params.id.toUpperCase() = "SR"
    );
    const hnFilterYear = accessToHN.filter(
      (patientHN) => `${patientHN[2]}${patientHN[3]}` === getYear() // hnFilterYear = ["SR240101","RC240101","SR240102"]
    );
    const hnFilterMonth = accessToHN.filter(
      (patientHN) => `${patientHN[4]}${patientHN[5]}` === getMonth() // hnFilterMonth = ["SR240101","RC240101","SR240102"]
    );
    const resultFilter = hnFilterBranch.filter((hn) => {
      return hnFilterYear.includes(hn) && hnFilterMonth.includes(hn);
    }); //resultFilter = ["SR240101","SR240102"]

    console.log(resultFilter);

    const accessToRunNumber = resultFilter.map(
      (eachHN) => Number(eachHN.slice(6, 8)) //accessToRunNumber = [1,2]
    );
    const findMaxOfRunNumber =
      accessToRunNumber.length === 0 ? 0 : Math.max(...accessToRunNumber); //findMaxOfRunNumber = 2, if no match return 0
    const formatMaxOfRunNumber =
      findMaxOfRunNumber + 1 > 9
        ? `${findMaxOfRunNumber + 1}`
        : `0${findMaxOfRunNumber + 1}`;
    return formatMaxOfRunNumber; // formatMaxOfRunNumber = "02"
  };

  const postNewPatient = async (newHN) => {
    try {
      await axios.post("http://localhost:2001/patients", {
        HN: newHN,
        idCard: idCard,
        firstName: firstName,
        surName: surName,
        picture:
          "https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg",
        courseRemaining: 0,
      });
    } catch {
      alert("post error");
    }
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const patients = await getPatients();
      const newHN = createHN(
        getBranch(),
        getYear(),
        getMonth(),
        getRunNumber(patients)
      );
      await postNewPatient(newHN);
      setDisplayHN(newHN);
    } catch {
      alert("error during submit");
    }
  };

  return (
    <Form
      onSubmit={(event) => {
        handleSubmit(event);
      }}
      css={css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
      `}
    >
      <FloatingLabel controlId="floatingInput" label="First name">
        <Form.Control
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingInput" label="Surname">
        <Form.Control
          type="text"
          value={surName}
          onChange={(e) => setSurName(e.target.value)}
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingInput" label="Card ID">
        <Form.Control
          type="text"
          value={idCard}
          onChange={(e) => setIdcard(e.target.value)}
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingInput" label="Generate HN">
        <Form.Control type="text" value={displayHN} disabled readOnly />
      </FloatingLabel>

      <Button type="submit">Submit form</Button>
    </Form>
  );
}

export default NewPatient;
