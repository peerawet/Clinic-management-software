import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import InputPupUp from "./InputPopUp";
import { useState, useEffect } from "react";
import axios from "axios";
import Courses from "./Courses";

function Buy({ activeTab }) {
  const [courses, setCourses] = useState([]);
  const [inputHn, setInputHn] = useState("");
  const [show, setShow] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState({});

  useEffect(() => {
    getCourses();
  }, [activeTab]);

  const getCourses = async () => {
    const response = await axios.get("http://localhost:2001/courses");
    const allCourses = response.data.data;
    const activeCourses = allCourses.filter(
      (course) => course.status === "active"
    );

    setCourses(activeCourses);
  };

  return (
    <>
      <Courses
        courses={courses}
        setCourses={setCourses}
        setShow={setShow}
        setSelectedCourse={setSelectedCourse}
      />
      <InputPupUp
        courses={courses}
        show={show}
        setShow={setShow}
        selectedCourse={selectedCourse}
        inputHn={inputHn}
        setInputHn={setInputHn}
      />
    </>
  );
}
export default Buy;
