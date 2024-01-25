import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TaskTable from "./TaskTable";
import DatePicker from "react-datepicker";
import axios from "axios";

function CheckIn({ setActiveTab, setSearchPatients, activeTab }) {
  const [listAppointments, setListAppointments] = useState([]);
  const [selectDate, setSelectDate] = useState(new Date());
  const params = useParams();

  useEffect(() => {
    fetchAppointments();
  }, [activeTab, selectDate]);

  const fetchAppointments = async () => {
    const dateToFetch = selectDate.getTime();
    try {
      const response = await axios.get(
        `http://localhost:2001/appointments/on-date/${dateToFetch}?branch=${params.id}`
      );

      setListAppointments(response.data.data);
      console.log(listAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  return (
    <>
      <DatePicker
        selected={selectDate}
        onChange={(date) => {
          setSelectDate(date);
        }}
      />
      <TaskTable
        listAppointments={listAppointments}
        selectDate={selectDate}
        fetchAppointments={fetchAppointments}
        setActiveTab={setActiveTab}
        setSearchPatients={setSearchPatients}
      />
    </>
  );
}

export default CheckIn;
