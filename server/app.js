import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import doctors from "./doctors.js";
import patients from "./patients.js";
import appointments from "./appointments.js";

const app = express();
const port = 2001;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Appointments endpoints
app.get("/appointments", (req, res) => {
  res.json({
    data: appointments,
  });
});

app.post("/appointments", (req, res) => {
  appointments.push(req.body);
  res.json({
    message: "Appointment has been created.",
  });
});

app.put("/appointments/:id", (req, res) => {
  const updatedAppointment = req.body;
  const appointmentId = req.params.id;

  const hasFound = appointments.find(
    (appointment) => appointment.id === appointmentId
  );

  if (!hasFound) {
    res.status(404).json({
      message: `Appointment with ID ${appointmentId} not found`,
    });
  }

  const appointmentIndex = appointments.findIndex((appointment) => {
    return appointment.id === appointmentId;
  });

  appointments[appointmentIndex] = {
    id: appointmentId,
    ...updatedAppointment,
  };

  res.json({
    message: `Appointment with ID ${appointmentId} has been updated.`,
  });
});

app.delete("/appointments/:id", (req, res) => {
  const appointmentId = req.params.id;

  const hasFound = appointments.find(
    (appointment) => appointment.id === appointmentId
  );

  if (!hasFound) {
    res.status(404).json({
      message: `Appointment with ID ${appointmentId} not found`,
    });
  }

  appointments = appointments.filter((appointment) => {
    return appointmentId !== appointment.id;
  });

  res.json({
    message: `Appointment with ID ${appointmentId} has been deleted.`,
  });
});

// Doctors endpoints
app.get("/doctors", (req, res) => {
  res.json({
    data: doctors,
  });
});

app.post("/doctors", (req, res) => {
  doctors.push(req.body);
  res.json({
    message: "Doctor has been added.",
  });
});

app.put("/doctors/:license", (req, res) => {
  const updatedDoctor = req.body;
  const doctorLicense = req.params.license;

  const hasFound = doctors.find((doctor) => doctor.license === doctorLicense);

  if (!hasFound) {
    res.status(404).json({
      message: `Doctor with license ${doctorLicense} not found`,
    });
  }

  const doctorIndex = doctors.findIndex((doctor) => {
    return doctor.license === doctorLicense;
  });

  doctors[doctorIndex] = {
    license: doctorLicense,
    ...updatedDoctor,
  };

  res.json({
    message: `Doctor with license ${doctorLicense} has been updated.`,
  });
});

app.delete("/doctors/:license", (req, res) => {
  const doctorLicense = req.params.license;

  const hasFound = doctors.find((doctor) => doctor.license === doctorLicense);

  if (!hasFound) {
    res.status(404).json({
      message: `Doctor with license ${doctorLicense} not found`,
    });
  }

  doctors = doctors.filter((doctor) => {
    return doctorLicense !== doctor.license;
  });

  res.json({
    message: `Doctor with license ${doctorLicense} has been deleted.`,
  });
});

// Patients endpoints
app.get("/patients", (req, res) => {
  res.json({
    data: patients,
  });
});

app.post("/patients", (req, res) => {
  patients.push(req.body);
  res.json({
    message: "Patient has been created.",
  });
});

app.put("/patients/:hn", (req, res) => {
  const updatedPatient = req.body;
  const patientHN = req.params.hn;

  const hasFound = patients.find((patient) => patient.HN === patientHN);

  if (!hasFound) {
    res.status(404).json({
      message: `Patient with HN ${patientHN} not found`,
    });
  }

  const patientIndex = patients.findIndex((patient) => {
    return patient.HN === patientHN;
  });

  patients[patientIndex] = {
    HN: patientHN,
    ...updatedPatient,
  };

  res.json({
    message: `Patient with HN ${patientHN} has been updated.`,
  });
});

app.delete("/patients/:hn", (req, res) => {
  const patientHN = req.params.hn;

  const hasFound = patients.find((patient) => patient.HN === patientHN);

  if (!hasFound) {
    res.status(404).json({
      message: `Patient with HN ${patientHN} not found`,
    });
  }

  patients = patients.filter((patient) => {
    return patientHN !== patient.HN;
  });

  res.json({
    message: `Patient with HN ${patientHN} has been deleted.`,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
