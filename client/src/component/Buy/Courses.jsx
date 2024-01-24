import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useState } from "react";
import InputPupUp from "./InputPopUp";

function Courses({ setCourses, courses, setShow, setSelectedCourse }) {
  const handleSelect = (course) => {
    setShow(true);
    setSelectedCourse(course);
  };

  return (
    <>
      <div
        css={css`
          display: flex;
          flex-direction: row;
          gap: 1rem;
          flex-wrap: wrap;
          max-width: 900px;
        `}
      >
        {courses.map((course) => {
          return (
            <Card style={{ width: "18rem" }} key={course._id}>
              <Card.Img
                variant="top"
                src={course.picture}
                css={css`
                  aspect-ratio: 1;
                `}
              />
              <Card.Body>
                <Card.Title>{course.price.toLocaleString()} Bath</Card.Title>
                <Card.Text>{course.name}</Card.Text>
                <Button
                  variant="primary"
                  css={css`
                    width: 100%;
                  `}
                  onClick={() => {
                    handleSelect(course);
                  }}
                >
                  Select
                </Button>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </>
  );
}
export default Courses;
