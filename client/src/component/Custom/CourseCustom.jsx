import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import axios from "axios";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";

function CourseCustom({ treatmentsData, branchsData }) {
  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [courses, setCourses] = useState([]);
  const [isHideInactive, setIsHideInactive] = useState(false);
  const [updateCourseStatus, setUpdateCourseStatus] = useState(false);

  useEffect(() => {
    getCourses();
  }, [selectedTreatment, isHideInactive, updateCourseStatus]);

  const getCourses = async () => {
    try {
      const response = await axios.get("http://localhost:2001/courses");
      let data = response.data.data;

      if (selectedTreatment) {
        data = data.filter(
          (course) => course.treatment_id === selectedTreatment
        );
      }

      if (isHideInactive) {
        data = data.filter((course) => course.status === "active");
      }

      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    console.log(courses);
  };

  const handleSwitch = (e) => {
    setIsHideInactive(e.target.checked);
  };

  const handleInactiveCourse = async (course) => {
    try {
      const updatedCourse = { ...course, status: "inactive" };
      await axios.put(
        `http://localhost:2001/courses/${course._id}`,
        updatedCourse
      );

      setUpdateCourseStatus((prev) => !prev);
    } catch (error) {
      console.error("Error updating course status:", error);
    }
  };

  const handleActiveCourse = async (course) => {
    try {
      const updatedCourse = { ...course, status: "active" };
      await axios.put(
        `http://localhost:2001/courses/${course._id}`,
        updatedCourse
      );

      setUpdateCourseStatus((prev) => !prev);
    } catch (error) {
      console.error("Error updating course status:", error);
    }
  };

  const handleUpdatePermitted = async (course, branch) => {
    try {
      const updatedCourses = courses.map((c) =>
        c._id === course._id
          ? {
              ...c,
              permitted: {
                ...c.permitted,
                [branch._id]: !c.permitted[branch._id],
              },
            }
          : c
      );

      // Optimistically update the state
      setCourses(updatedCourses);

      await axios.put(`http://localhost:2001/courses/${course._id}`, {
        permitted: {
          ...course.permitted,
          [branch._id]: !course.permitted[branch._id],
        },
      });

      console.log(
        `Course ${course._id} has been updated for branch ${branch._id}.`
      );
    } catch (error) {
      console.error("Error updating course:", error);

      // Rollback the state if there's an error
      setCourses((prevCourses) => prevCourses);
    }
  };

  return (
    <div
      css={css`
        flex-direction: column;
        display: flex;
        gap: 1rem;
      `}
    >
      <Form
        css={css`
          width: fit-content;
          flex-direction: column;
          display: flex;
          gap: 1rem;
        `}
      >
        <Form.Select
          aria-label="Default select example"
          onChange={(e) => {
            setSelectedTreatment(e.target.value);
          }}
        >
          <option value="">แสดงทุกการรักษา</option>
          {treatmentsData.map((treatment) => (
            <option key={treatment._id} value={treatment._id}>
              {treatment.name}
            </option>
          ))}
        </Form.Select>
        <Form.Check
          type="switch"
          id="custom-switch"
          label="ซ่อนคอร์สที่ไม่ใช้งานแล้ว"
          onChange={handleSwitch}
        />
      </Form>
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
                  filter: ${course.status === "inactive" && "blur(5px)"};
                  aspect-ratio: 1;
                `}
              />
              <Card.Body>
                <Card.Title>
                  {course.price.toLocaleString()} Bath ({course.status})
                </Card.Title>
                <Card.Text>{course.name}</Card.Text>

                <Form.Group>
                  <Form.Label>สาขาที่สามารถใช้ได้</Form.Label>
                  {branchsData.map((branch) => {
                    return (
                      course.status === "active" && (
                        <Form.Check
                          key={branch._id}
                          type="switch"
                          id={`custom-switch-${branch._id}`}
                          defaultChecked={course.permitted[branch._id]}
                          label={branch.name}
                          onChange={() => {
                            handleUpdatePermitted(course, branch);
                          }}
                        />
                      )
                    );
                  })}
                </Form.Group>

                {course.status === "active" && (
                  <Button
                    variant="danger"
                    css={css`
                      width: 100%;
                    `}
                    onClick={() => {
                      handleInactiveCourse(course);
                    }}
                  >
                    ไม่ขายคอร์สนี้แล้ว
                  </Button>
                )}
                {course.status === "inactive" && (
                  <Button
                    variant="success"
                    css={css`
                      width: 100%;
                    `}
                    onClick={() => {
                      handleActiveCourse(course);
                    }}
                  >
                    เอากลับมาขายใหม่
                  </Button>
                )}
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default CourseCustom;
