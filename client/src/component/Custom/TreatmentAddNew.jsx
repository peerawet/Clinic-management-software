import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
function TreatmentAddNew({ branchsData, treatmentsData }) {
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    allow: {},
    details: [{ procedure: "", price: 0 }], // Initialize price with 0
  });

  const handleDetailChange = (index, field, value) => {
    setFormData((prevData) => {
      const newDetails = [...prevData.details];
      newDetails[index][field] = field === "price" ? parseFloat(value) : value;
      return {
        ...prevData,
        details: newDetails,
      };
    });
  };

  const handleAddDetail = () => {
    setFormData((prevData) => ({
      ...prevData,
      details: [...prevData.details, { procedure: "", price: 0 }],
    }));
  };

  const handleRemoveDetail = (index) => {
    setFormData((prevData) => {
      const newDetails = [...prevData.details];
      newDetails.splice(index, 1);
      return {
        ...prevData,
        details: newDetails,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // You may want to perform additional client-side validation here

    const postData = formData;
    await axios.post(`http://localhost:2001/treatments/`, postData);

    alert("treatment has been created");
  };

  const handleSwitchChange = (e, branchId) => {
    console.log(branchId);
    setFormData((prevData) => ({
      ...prevData,
      allow: {
        ...prevData.allow,
        [branchId]: !prevData.allow[branchId],
      },
    }));
  };

  return (
    <>
      <Form
        css={css`
          display: flex;
          flex-direction: column;
          gap: 1rem;
        `}
        onSubmit={handleSubmit}
      >
        <div
          css={css`
            display: flex;
            flex-direction: row;
            gap: 2rem;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;

              width: 40%;
            `}
          >
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>ชื่อการรักษา</Form.Label>
              <Form.Control
                type="text"
                placeholder="'High laser therapy'"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="total">
              <Form.Label>อักษรย่อ (ID)</Form.Label>
              <Form.Control
                type="text"
                placeholder="'HLT'"
                onChange={(e) =>
                  setFormData({ ...formData, _id: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>สาขาที่ใช้ได้</Form.Label>

              {branchsData.map((branch) => (
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label={branch.name}
                  onChange={(e) => {
                    handleSwitchChange(e, branch._id);
                  }}
                  checked={formData.allow[branch._id] || false}
                />
              ))}
            </Form.Group>
          </div>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 1rem;
              width: 40%;
            `}
          >
            <Form.Group
              className="mb-3"
              controlId="details"
              css={css`
                gap: 1rem;
                display: flex;
                flex-direction: column;
              `}
            >
              <Form.Label>Treatment Details</Form.Label>
              {formData.details.map((detail, index) => (
                <div key={index}>
                  <Form.Control
                    type="text"
                    placeholder="Procedure"
                    value={detail.procedure}
                    onChange={(e) =>
                      handleDetailChange(index, "procedure", e.target.value)
                    }
                  />
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    value={detail.price}
                    onChange={(e) =>
                      handleDetailChange(index, "price", e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveDetail(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" size="sm" onClick={handleAddDetail}>
                Add Detail
              </Button>
            </Form.Group>
          </div>
        </div>
        <Button type="submit">เพิ่มการรักษา</Button>
      </Form>
    </>
  );
}

export default TreatmentAddNew;
