import { Router } from "express";
import beingTreated from "../data/beingTreated.js";

export const beingTreatedRouter = Router();
//BeingTreated section
beingTreatedRouter.get("/", (req, res) => {
  res.json({
    data: beingTreated,
  });
});

beingTreatedRouter.post("/", (req, res) => {
  try {
    const newAppointment = req.body;

    beingTreated.push(newAppointment);
    res.json({
      message: "Appointment has been created.",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid request. Please provide valid appointment data.",
      error: error.message,
    });
  }
});

beingTreatedRouter.delete("/:id", (req, res) => {
  const appointmentId = req.params.id;

  const indexOfAppointment = beingTreated.findIndex(
    (appointment) => appointment.id === appointmentId
  );

  if (indexOfAppointment === -1) {
    return res.status(404).json({
      message: `Appointment with ID ${appointmentId} not found`,
    });
  }

  beingTreated.splice(indexOfAppointment, 1);

  return res.json({
    message: `Appointment with ID ${appointmentId} has been deleted.`,
  });
});
