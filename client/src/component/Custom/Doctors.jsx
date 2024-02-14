import Table from "react-bootstrap/Table";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

function Doctors() {
  const [selectedDoctor, setSelectedDoctor] = useState({});
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    getDoctors();
  }, []);

  const getDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:2001/doctors/");
      setDoctors(response.data.data);
    } catch (error) {
      console.error("Error fetching doctors", error);
    }
  };

  const handleInputChange = (field, value) => {
    setSelectedDoctor((prevDoctor) => ({
      ...prevDoctor,
      [field]: value,
    }));
    console.log(selectedDoctor);
  };

  const handleAddDoctors = async () => {
    try {
      await axios.post("http://localhost:2001/doctors/", selectedDoctor);
      getDoctors();
      setSelectedDoctor({});
    } catch (error) {
      console.error("Error adding doctor", error);
      alert("doctors has been created");
    }
  };

  const handleEditDoctors = async () => {
    try {
      await axios.put(`http://localhost:2001/doctors/${selectedDoctor._id}`, {
        // Pass individual fields instead of the entire object
        name: selectedDoctor.name,
        branch: selectedDoctor.branch,
        picture: selectedDoctor.picture,
      });

      // Refresh the doctor list after editing
      getDoctors();

      // Clear the selectedDoctor state
      setSelectedDoctor({});
      alert("doctors has been updated");
    } catch (error) {
      console.error("Error editing doctor", error);
    }
  };

  return (
    <>
      <div
        css={css`
          display: flex;
          gap: 1rem;
        `}
      >
        {doctors.map((doctor) => (
          <Card style={{ width: "18rem" }}>
            <Card.Img
              variant="top"
              src={doctor.picture}
              css={css`
                aspect-ratio: 1;
              `}
            />
            <Card.Body>
              <Card.Title>
                {doctor.name} {doctor._id}
              </Card.Title>
              <Card.Text></Card.Text>
              <Button
                variant="primary"
                key={doctor._id}
                onClick={() => {
                  setSelectedDoctor(doctor);
                }}
                css={css`
                  width: 100%;
                `}
              >
                เลือก
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Doctor name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Somchai"
            value={selectedDoctor.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>License(ID)</Form.Label>
          <Form.Control
            type="text"
            placeholder="421632"
            value={selectedDoctor._id || ""}
            onChange={(e) => handleInputChange("_id", e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>ประจำสาขา</Form.Label>
          <Form.Control
            type="text"
            placeholder="SR"
            value={selectedDoctor.branch || ""}
            onChange={(e) => handleInputChange("branch", e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>รูปภาพ</Form.Label>
          <Form.Control
            type="text"
            placeholder="url"
            value={selectedDoctor.picture || ""}
            onChange={(e) => handleInputChange("picture", e.target.value)}
          />
        </Form.Group>
        <div
          css={css`
            display: flex;
            gap: 1rem;
          `}
        >
          <Button onClick={handleAddDoctors}>เพิ่มนักกายภาพใหม่</Button>
          <Button onClick={handleEditDoctors}>แก้ไขนักกายภาพ</Button>
        </div>
      </Form>
    </>
  );
}

export default Doctors;
