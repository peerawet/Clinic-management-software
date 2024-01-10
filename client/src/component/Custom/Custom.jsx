import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CustomAppointments from "./CustomAppointments";
import CustomPatients from "./CustomPatients";
import CustomDoctors from "./CustomDoctors";
function Custom() {
  return (
    <Tabs
      defaultActiveKey="profile"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="Appointments" title="Appointments">
        <CustomAppointments />
      </Tab>
      <Tab eventKey="Patients" title="Patients">
        <CustomPatients />
      </Tab>
      <Tab eventKey="Doctors" title="Doctors">
        <CustomDoctors />
      </Tab>
    </Tabs>
  );
}
export default Custom;
