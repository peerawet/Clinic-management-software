import Table from "react-bootstrap/Table";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

function Branchs() {
  const [inputName, setInputName] = useState("");
  const [inputId, setInputId] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!inputName || !inputId) {
      return;
    }

    try {
      axios.post("http://localhost:2001/branchs", {
        name: inputName,
        _id: inputId,
        picture:
          "https://apis.airportthai.co.th/microsite/images/post/ckeditor/shutterstock_313815821.jpg",
      });

      setInputName("");
      setInputId("");
      alert("branch has been created");
    } catch (error) {
      console.error("Error adding branch:", error);
    }
  };

  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Branch name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Sriracha"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>ชื่อย่อ(ID)</Form.Label>
          <Form.Control
            type="text"
            placeholder="SR"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">เพิ่มสาขา</Button>
      </Form>
    </>
  );
}

export default Branchs;
