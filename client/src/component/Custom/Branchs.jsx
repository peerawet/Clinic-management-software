import Table from "react-bootstrap/Table";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

function CustomDoctors() {
  const [doctors, setDoctors] = useState([]);
  const tableHeading = ["License", "Name", "Branch"];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:2001/doctors");
      const data = response.data.data;
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  return (
    <>
      <Button onClick={fetchDoctors}>Refresh</Button>
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
          {doctors.map((doctor, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{doctor.license}</td>
              <td>{doctor.name}</td>
              <td>{doctor.branch}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default CustomDoctors;
