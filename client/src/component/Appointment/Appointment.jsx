import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import AppointmentCreate from "./Appointment-Create/Appointment-Create";
import AppointmentReschule from "./Appointment-Reschedule/Appointment-Reschedule";

function Appointment(props) {
  return (
    <Tabs
      defaultActiveKey="Create"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="Create" title="Create">
        <AppointmentCreate {...props} />
      </Tab>
      <Tab eventKey="Reschedule" title="Reschedule">
        <AppointmentReschule />
      </Tab>
      <Tab eventKey="Cancel" title="Cancel">
        Tab content for Contact
      </Tab>
    </Tabs>
  );
}

export default Appointment;
