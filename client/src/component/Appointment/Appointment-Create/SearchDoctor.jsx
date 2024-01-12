import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import format from "date-fns/format";

function SearchDoctor({
  setShowButtonDoctor,
  selectedDate,
  setSelectedDate,
  setSelectedTime,
  setSearchDoctors,
  selectedTime,
  searchDoctors,
  showButtonDoctor,
}) {
  const params = useParams();

  const handleSearchDoctor = async (event) => {
    event.preventDefault();
    const response = await axios.get("http://localhost:2001/appointments/");
    const appointments = response.data.data;
    const availableDoctors = await findAvailableDoctors(appointments);

    if (availableDoctors.length > 0) {
      setSearchDoctors([...availableDoctors]);
      setShowButtonDoctor(true);
    } else {
      alert("No available doctors found.");
      setSearchDoctors([...availableDoctors]);
    }
  };

  const handleConfirmDoctor = (confirmlisence) => {
    const result = searchDoctors.filter((doctor) => {
      return doctor.license === confirmlisence;
    });
    setSearchDoctors([...result]);
    setShowButtonDoctor(false);
  };

  const formatDate = () => {
    const date = format(selectedDate, "yyyy-MM-dd");
    const dateArray = date.split("-");
    const dateObject = {
      year: dateArray[0] || "",
      month: dateArray[1] || "",
      day: dateArray[2] || "",
    };
    return dateObject;
  };

  const findAvailableDoctors = async (appointments) => {
    const dateObject = formatDate();
    const time = selectedTime;
    const unAvailableDoctors = appointments
      .filter(
        (appointment) =>
          appointment.year === dateObject.year &&
          appointment.month === dateObject.month &&
          appointment.day === dateObject.day &&
          appointment.time === time
      )
      .map((appointment) => appointment.license);
    console.log(unAvailableDoctors);
    const response = await axios.get("http://localhost:2001/doctors");
    const doctors = response.data.data;
    const availableDoctors = doctors.filter(
      (doctor) => !unAvailableDoctors.includes(doctor.license)
    );
    const availibleDoctorsInSpecificBranch = availableDoctors.filter(
      (doctor) => doctor.branch === params.id.toLocaleUpperCase()
    );
    return availibleDoctorsInSpecificBranch;
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
      <h4>Fill in appointment</h4>
      <Form
        css={css`
          display: flex;
          flex-direction: column;
          gap: 1rem;
        `}
        onSubmit={handleSearchDoctor}
      >
        <FloatingLabel
          css={css`
            flex: 1;
          `}
          label="Branch"
        >
          <Form.Control
            type="text"
            value={params.id.toLocaleUpperCase()}
            disabled
          />
        </FloatingLabel>
        <div>
          <h6>Pick date</h6>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            isClearable
            placeholderText="Select a date"
          />
        </div>
        <div>
          <h6>Pick time</h6>
          <Form.Select
            onChange={(e) => {
              setSelectedTime(e.target.value);
            }}
            defaultValueValue={selectedTime}
          >
            <option value="09">9.00-10.00</option>
            <option value="10">10.00-11.00</option>
            <option value="11">11.00-12.00</option>
            <option value="12">12.00-13.00</option>
            <option value="13">13.00-14.00</option>
            <option value="14">14.00-15.00</option>
            <option value="15">15.00-16.00</option>
            <option value="16">16.00-17.00</option>
            <option value="17">17.00-18.00</option>
          </Form.Select>
        </div>

        <Button
          css={css`
            flex: 1;
          `}
          type="submit"
        >
          Search available physical therapist
        </Button>
      </Form>

      {searchDoctors.map((doctor) => {
        return (
          <div
            key={doctor.license}
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
            <img
              src={doctor.picture}
              css={css`
                width: 13rem;
              `}
            ></img>
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 1rem;
                flex: 1;
              `}
            >
              <FloatingLabel label="Physical therapist name">
                <Form.Control
                  type="text"
                  value={doctor.name}
                  disabled
                  readOnly
                />
              </FloatingLabel>
              <FloatingLabel label="License">
                <Form.Control
                  type="text"
                  value={doctor.license}
                  disabled
                  readOnly
                />
              </FloatingLabel>
              <Button
                onClick={() => {
                  handleConfirmDoctor(doctor.license);
                }}
                css={css`
                  display: ${showButtonDoctor ? "block" : "none"};
                `}
              >
                Confirm Doctor
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SearchDoctor;
