import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
function AddNewCourse({ branchsData, treatmentsData }) {
  return (
    <>
      <Form
        css={css`
          display: flex;
          flex-direction: column;
          gap: 1rem;
        `}
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
            <Form.Group className="mb-3" controlId="treatment">
              <Form.Label>เลือกการรักษาสำหรับคอร์สนี้</Form.Label>
              <Form.Select aria-label="Default select example">
                <option>โปรดเลือกประเภทการรักษา</option>
                {treatmentsData.map((treatment) => (
                  <option key={treatment._id} value={treatment._id}>
                    {treatment.name}/{treatment._id}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>ชื่อคอร์ส</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="total">
              <Form.Label>จำนวนครั้ง</Form.Label>
              <Form.Control type="number" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>ราคา</Form.Label>
              <Form.Control type="number" />
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
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>สาขาที่ใช้ได้</Form.Label>

              {branchsData.map((branch) => (
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label={branch.name}
                />
              ))}
            </Form.Group>
          </div>
        </div>
        <Button>สร้างคอร์ส</Button>
      </Form>
    </>
  );
}

export default AddNewCourse;
