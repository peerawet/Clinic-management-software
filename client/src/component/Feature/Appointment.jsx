import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import AppointmentCreate from "./Appointment-Create";
import AppointmentReschule from "./Appointment-Reschedule";

function Appointment() {
  return (
    <Tabs
      defaultActiveKey="Create"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="Create" title="Create">
        <AppointmentCreate />
      </Tab>
      <Tab eventKey="Reschedule" title="Reschedule">
        <AppointmentReschule />
      </Tab>
      <Tab eventKey="Cancle" title="Cancle">
        Tab content for Contact
      </Tab>
    </Tabs>
  );
}

export default Appointment;
