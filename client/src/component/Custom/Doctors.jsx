import Table from "react-bootstrap/Table";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

function CustomAppointments() {
  const [appointments, setAppointments] = useState([]);
  const tableHeading = [
    "ID",
    "Day",
    "Month",
    "Year",
    "Time",
    "HN",
    "License",
    "Branch",
    "Status",
  ];

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:2001/appointments");
      const data = response.data.data;
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  return (
    <>
      <Button onClick={fetchAppointments}>Refresh</Button>
      <Table responsive>
        <thead>
          <tr>
            <th>#</th>
            {tableHeading.map((heading, index) => (
              <th key={index}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{appointment.id}</td>
              <td>{appointment.day}</td>
              <td>{appointment.month}</td>
              <td>{appointment.year}</td>
              <td>{appointment.time}</td>
              <td>{appointment.HN}</td>
              <td>{appointment.license}</td>
              <td>{appointment.branch}</td>
              <td>{appointment.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default CustomAppointments;
