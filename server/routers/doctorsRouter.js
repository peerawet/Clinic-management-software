import { Router } from "express";
import doctors from "../data/doctors.js";

export const doctorsRouter = Router();
// Doctors endpoints
doctorsRouter.get("/", (req, res) => {
  res.json({
    data: doctors,
  });
});

doctorsRouter.get("/:license", (req, res) => {
  const doctorLicense = req.params.license;

  const foundDoctor = doctors.find(
    (doctor) => doctor.license === doctorLicense
  );

  if (!foundDoctor) {
    res.status(404).json({
      message: `Doctor with license ${doctorLicense} not found`,
    });
    return; // Return early to avoid further processing
  }

  res.json({
    data: foundDoctor,
  });
});

doctorsRouter.post("/", (req, res) => {
  doctors.push(req.body);
  res.json({
    message: "Doctor has been added.",
  });
});

doctorsRouter.put("/:license", (req, res) => {
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

doctorsRouter.delete("/:license", (req, res) => {
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
