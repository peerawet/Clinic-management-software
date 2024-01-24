import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Courses from "./Courses";

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
      <Tab eventKey="Doctors" title="Doctors">
        asd
      </Tab>
      <Tab eventKey="Branchs" title="Branchs">
        asd
      </Tab>
    </Tabs>
  );
}
export default Custom;
