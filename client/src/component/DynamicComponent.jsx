import "react";
import CheckIn from "./CheckIn/CheckIn";
import NewPatient from "./NewPatient/NewPatient";
import Appointment from "./Appointment/Appointment";
import Custom from "./Custom/Custom";

function DynamicComponent({ type, ...props }) {
  switch (type) {
    case "CheckIn":
      return <CheckIn {...props} />;
    case "NewPatient":
      return <NewPatient {...props} />;
    case "Appointment":
      return <Appointment {...props} />;
    case "Custom":
      return <Custom />;
  }

  return <>Not render</>;
}

export default DynamicComponent;
