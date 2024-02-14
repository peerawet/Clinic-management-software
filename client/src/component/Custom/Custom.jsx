import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Courses from "./Courses";
import Treatments from "./Treatments";
import Branchs from "./Branchs";
import Doctors from "./Doctors";

function Custom() {
  return (
    <Tabs
      defaultActiveKey="Courses"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="Courses" title="Courses">
        <Courses />
      </Tab>
      <Tab eventKey="Treatments" title="Treatments">
        <Treatments />
      </Tab>
      <Tab eventKey="Doctors" title="Doctors">
        <Doctors />
      </Tab>
      <Tab eventKey="Branchs" title="Branchs">
        <Branchs />
      </Tab>
    </Tabs>
  );
}
export default Custom;
