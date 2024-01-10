import Table from "react-bootstrap/Table";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

function CustomPatients() {
  const [patients, setPatients] = useState([]);
  const tableHeading = ["HN", "ID Card", "First Name", "Surname", "Course"];

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:2001/patients");
      const data = response.data.data;
      setPatients(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  return (
    <>
      <Button onClick={fetchPatients}>Refresh</Button>
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
          {patients.map((patient, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{patient.HN}</td>
              <td>{patient.idCard}</td>
              <td>{patient.firstName}</td>
              <td>{patient.surName}</td>
              <td>{patient.courseRemaining}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default CustomPatients;
