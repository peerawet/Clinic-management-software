import { Router } from "express";
import patients from "../data/patients.js";

export const patientsRouter = Router();
// Patients endpoints
patientsRouter.get("/", (req, res) => {
  res.json({
    data: patients,
  });
});

patientsRouter.get("/:hn", (req, res) => {
  const patientHN = req.params.hn;

  const foundPatient = patients.find((patient) => patient.HN === patientHN);

  if (!foundPatient) {
    res.status(404).json({
      message: `Patient with HN ${patientHN} not found`,
    });
    return; // Return early to avoid further processing
  }

  res.json({
    data: foundPatient,
  });
});

patientsRouter.post("/", (req, res) => {
  patients.push(req.body);
  res.json({
    message: "Patient has been created.",
  });
});

patientsRouter.put("/:hn", (req, res) => {
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

patientsRouter.delete("/:hn", (req, res) => {
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
