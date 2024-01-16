import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import format from "date-fns/format";

function SearchDoctor({
  setShowButtonDoctor,
  setSearchDoctors,
  searchDoctors,
  showButtonDoctor,
  setSelectedEndDate,
  selectedEndDate,
  setSelectedStartDate,
  selectedStartDate,
}) {
  const params = useParams();

  useEffect(() => {
    const endDate = new Date(selectedStartDate.getTime() + 3600 * 1000);
    setSelectedEndDate(endDate);
  }, [selectedStartDate]);

  const handleSearchDoctor = async (event) => {
    try {
      event.preventDefault();

      const startDate = selectedStartDate.getTime();
      const endDate = selectedEndDate.getTime();

      const url = `http://localhost:2001/doctors/available/${params.id}?startTimeStamp=${startDate}&endTimeStamp=${endDate}`;
      const response = await axios.get(url);

      const availableDoctors = response.data.data;

      if (availableDoctors.length > 0) {
        setSearchDoctors(availableDoctors);
        setShowButtonDoctor(true);
      } else {
        alert("No available doctors found.");
        setSearchDoctors([]);
        setShowButtonDoctor(false);
      }
    } catch (error) {
      console.error("Error fetching available doctors:", error);
      alert(
        "An error occurred while fetching available doctors. Please check the console for more details."
      );
    }
  };

  const handleConfirmDoctor = (confirmlisence) => {
    const result = searchDoctors.filter((doctor) => {
      return doctor._id === confirmlisence;
    });
    setSearchDoctors([...result]);
    setShowButtonDoctor(false);
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

        <div
          css={css`
            display: flex;
            gap: 1rem;
          `}
        >
          <div
            css={css`
              flex: 1;
            `}
          >
            <h6>Pick start date</h6>
            <DatePicker
              selected={selectedStartDate}
              onChange={(date) => setSelectedStartDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={60}
              dateFormat="MMMM d, yyyy HH:mm "
              timeCaption="Time"
            />
          </div>
          <div
            css={css`
              flex: 1;
            `}
          >
            <h6>End date</h6>
            <DatePicker
              selected={selectedEndDate}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={60}
              dateFormat="MMMM d, yyyy HH:mm "
              timeCaption="Time"
              disabled
            />
          </div>
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
            key={doctor._id}
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
                  value={doctor._id}
                  disabled
                  readOnly
                />
              </FloatingLabel>
              <Button
                onClick={() => {
                  handleConfirmDoctor(doctor._id);
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
