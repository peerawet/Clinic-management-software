import { Router } from "express";
import appointments from "../data/appointments.js";

export const appointmentsRouter = Router();

// Appointments endpoints
appointmentsRouter.get("/", (req, res) => {
  res.json({
    data: appointments,
  });
});

appointmentsRouter.get("/:id", (req, res) => {
  const appointmentId = req.params.id;

  const foundAppointment = appointments.find(
    (appointment) => appointment.id === appointmentId
  );

  if (!foundAppointment) {
    res.status(404).json({
      message: `Appointment with ID ${appointmentId} not found`,
    });
  }

  res.json({
    data: foundAppointment,
  });
});

appointmentsRouter.post("/", (req, res) => {
  const duplicateAppointment = appointments.find(
    (appointment) =>
      appointment.year === req.body.year &&
      appointment.month === req.body.month &&
      appointment.day === req.body.day &&
      appointment.time === req.body.time &&
      appointment.license === req.body.license
  );

  if (duplicateAppointment) {
    return res.status(404).json({
      message: "Appointment is a duplicate date",
    });
  }
  appointments.push(req.body);
  return res.json({
    message: "Appointment has been created.",
  });
});

appointmentsRouter.put("/:id", (req, res) => {
  const updatedAppointment = req.body;
  const appointmentId = req.params.id;
  const duplicateAppointment = appointments.find(
    (appointment) =>
      appointment.year === req.body.year &&
      appointment.month === req.body.month &&
      appointment.day === req.body.day &&
      appointment.time === req.body.time &&
      appointment.license === req.body.license &&
      req.body === "booked"
  );

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
  if (duplicateAppointment) {
    return res.status(400).json({
      message: "Appointment is a duplicate date",
    });
  }
  appointments[appointmentIndex] = {
    ...updatedAppointment,
  };

  res.json({
    message: `Appointment with ID ${appointmentId} has been updated.`,
  });
});

appointmentsRouter.delete("/:id", (req, res) => {
  const appointmentId = req.params.id;

  const hasFound = appointments.find(
    (appointment) => appointment.id === appointmentId
  );

  if (!hasFound) {
    res.status(404).json({
      message: `Appointment with ID ${appointmentId} not found`,
    });
  }

  appointments.filter((appointment) => {
    return appointmentId !== appointment.id;
  });

  res.json({
    message: `Appointment with ID ${appointmentId} has been deleted.`,
  });
});
