import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
function Tables() {
  return (
    <Tabs
      defaultActiveKey="Courses"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="Appointments" title="Appointments"></Tab>
      <Tab eventKey="Patients" title="Patients"></Tab>
      <Tab eventKey="Doctors" title="Doctors"></Tab>
      <Tab eventKey="Treatments" title="Treatments"></Tab>
      <Tab eventKey="Courses" title="Courses"></Tab>
      <Tab eventKey="Receipts" title="Receipts"></Tab>
      <Tab eventKey="Courses_Patients" title="Courses_Patients"></Tab>
      <Tab eventKey="Receipts_Treatments" title="Receipts_Treatments"></Tab>
      <Tab eventKey="Branchs" title="Branchs"></Tab>
    </Tabs>
  );
}

export default Tables;
