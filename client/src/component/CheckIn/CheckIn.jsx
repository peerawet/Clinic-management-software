import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import { useState } from "react";
import BeingTreated from "./BeingTreated";
import ConfirmAppointments from "./ConfirmAppointments";

function CheckIn({ setActiveTab, setSearchPatients, activeTab }) {
  const [searchBox, setSearchBox] = useState("");
  const [listAppointments, setListAppointments] = useState([]);
  const [beingTreatedRender, setBeingTreatedRender] = useState([]);
  const [isComfirmpatient, setIsComfirmpatient] = useState(false);
  let checkInDate = new Date();

  const handleSearch = (e) => {
    const searchText = e.target.value;
    setSearchBox(searchText);
    const filteredAppointments = listAppointments.filter(
      (appointment) =>
        appointment.id.includes(searchText) ||
        appointment.patientInfo.firstName.includes(searchText) ||
        appointment.patientInfo.surName.includes(searchText) ||
        appointment.time.includes(searchText) ||
        appointment.doctorInfo.name.includes(searchText)
    );
    setListAppointments(filteredAppointments);
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
          label="Search"
          css={css`
            flex: 2;
          `}
        >
          <Form.Control type="text" onChange={handleSearch} value={searchBox} />
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
            fetchAppointmentsToday();
          }}
        >
          Refresh
        </Button>
      </div>

      <div
        css={css`
          display: ${listAppointments.length === 0 &&
          beingTreatedRender.length === 0
            ? "none"
            : "flex"};
          flex-direction: row;
          /* display: flex; */
          gap: 1rem;
          border: solid black 1px;
          padding: 1rem;
          border-radius: 10px;
        `}
      >
        <ConfirmAppointments
          activeTab={activeTab}
          setBeingTreatedRender={setBeingTreatedRender}
          isComfirmpatient={isComfirmpatient}
          listAppointments={listAppointments}
          setListAppointments={setListAppointments}
        />
        <BeingTreated
          beingTreatedRender={beingTreatedRender}
          setBeingTreatedRender={setBeingTreatedRender}
          activeTab={activeTab}
          setSearchPatients={setSearchPatients}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}

export default CheckIn;
