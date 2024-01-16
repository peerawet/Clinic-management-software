import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */

function NewPatient() {
  const [name, setName] = useState("");
  const [displayHN, setDisplayHN] = useState("");

  const params = useParams();

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const newHN = await axios.post(
        `http://localhost:2001/patients/${params.id}`,
        {
          name: name,
          picture:
            "https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg",
        }
      );

      setDisplayHN(newHN.data.data);
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
      <FloatingLabel controlId="floatingInput" label="Name">
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
