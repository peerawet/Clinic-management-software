import AddNewCourse from "./CourseAddNew";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CourseCustom from "./CourseCustom";
import axios from "axios";
import { useState, useEffect } from "react";
function Courses() {
  const [branchsData, setBranchsData] = useState([]);
  const fetchBranchData = async () => {
    try {
      const response = await axios.get("http://localhost:2001/branchs");
      setBranchsData(response.data.data);
    } catch (error) {
      alert("Error fetching branch data:", error);
    }
  };
  useEffect(() => {
    fetchBranchData();
  }, []);
  const [treatmentsData, setTreatmentsData] = useState([]);
  useEffect(() => {
    fetchTreatments();
  }, []);
  const fetchTreatments = async () => {
    try {
      const response = await axios.get("http://localhost:2001/treatments");
      setTreatmentsData(response.data.data);
    } catch (error) {
      console.error("Error fetching treatments", error);
    }
  };

  return (
    <>
      <Tabs
        defaultActiveKey="Courses"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="Courses" title="สร้างคอร์สใหม่">
          <AddNewCourse
            branchsData={branchsData}
            treatmentsData={treatmentsData}
          />
        </Tab>
        <Tab eventKey="Doctors" title="ปรับแต่งคอร์สที่มีอยู่">
          <CourseCustom
            treatmentsData={treatmentsData}
            branchsData={branchsData}
          />
        </Tab>
      </Tabs>
    </>
  );
}

export default Courses;
