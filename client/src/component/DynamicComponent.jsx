import "react";
import CheckIn from "./CheckIn/CheckIn";
import NewPatient from "./NewPatient/NewPatient";
import Appointment from "./Appointment/Appointment";
import Buy from "./Buy/Buy";
import Custom from "./Custom/Custom";
import Tables from "./Tables/Tables";
function DynamicComponent({ type, ...props }) {
  switch (type) {
    case "CheckIn":
      return <CheckIn {...props} />;
    case "NewPatient":
      return <NewPatient {...props} />;
    case "Appointment":
      return <Appointment {...props} />;
    case "Buy":
      return <Buy {...props} />;
    case "Custom":
      return <Custom {...props} />;
    case "Tables":
      return <Tables {...props} />;
  }

  return <>Not render</>;
}

export default DynamicComponent;
