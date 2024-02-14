import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import axios from "axios";
import { useState, useEffect } from "react";
import TreatmentAddNew from "./TreatmentAddNew";
import TreatmentCustom from "./TreatmentCustom";
function Treatments() {
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
        <Tab eventKey="Courses" title="เพิ่มการรักษาใหม่">
          <TreatmentAddNew
            branchsData={branchsData}
            treatmentsData={treatmentsData}
          />
        </Tab>
        <Tab eventKey="Doctors" title="ปรับแต่งการรักษา">
          <TreatmentCustom
            treatmentsData={treatmentsData}
            branchsData={branchsData}
          />
        </Tab>
      </Tabs>
    </>
  );
}

export default Treatments;
