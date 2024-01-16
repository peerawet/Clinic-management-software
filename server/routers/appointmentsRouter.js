import { Router } from "express";
import { db } from "../utils/db.js";

export const appointmentsRouter = Router();

// Appointments endpoints

appointmentsRouter.get("/:id", (req, res) => {});

appointmentsRouter.get(
  "/appointments-today/:todayTimeStamp",
  async (req, res) => {
    try {
      const appointmentsCollection = db.collection("appointments");
      const todayTimeStamp = Number(req.params.todayTimeStamp);

      const startOfDay = new Date(todayTimeStamp);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(todayTimeStamp);
      endOfDay.setHours(23, 59, 59, 999);

      const appointmentToday = await appointmentsCollection
        .find({
          start: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
          status: "booked",
        })
        .toArray();

      res.json({ data: appointmentToday });
    } catch (error) {
      console.error("Error in appointmentsRouter:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

appointmentsRouter.get("/", async (req, res) => {
  try {
    const appointmentsCollection = db.collection("appointments");

    const status = req.query.status;

    const appointmentsFilteredByStatus = await appointmentsCollection
      .find({
        status: status,
      })
      .toArray();

    res.json({ data: appointmentsFilteredByStatus });
  } catch (error) {
    console.error("Error in appointmentsRouter:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const generateId = (startDate, license, branch) => {
  const day = startDate.getDate().toString().padStart(2, "0");
  const month = (startDate.getMonth() + 1).toString().padStart(2, "0");
  const year = startDate.getFullYear();
  const hours = startDate.getHours().toString().padStart(2, "0");
  const newId = `APPT-${branch}-${day}-${month}-${year}-${hours}-${license}`;
  return newId;
};

appointmentsRouter.post("/:branch/:license", async (req, res) => {
  const appointmentsCollection = db.collection("appointments");
  const branch = req.params.branch.toUpperCase();
  const license = req.params.license;
  const startDate = new Date(req.body.start);
  const endDate = new Date(req.body.end);
  const newId = generateId(startDate, license, branch);
  await appointmentsCollection.insertOne({
    ...req.body,
    _id: newId,
    start: startDate,
    end: endDate,
  });
  res.json({
    message: "appointment has been created.",
    data: newId,
  });
});

appointmentsRouter.put("/:id", async (req, res) => {
  const appointmentsCollection = db.collection("appointments");
  try {
    await appointmentsCollection.updateOne(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
          start: new Date(req.body.start),
          end: new Date(req.body.end),
          checkIn: req.body.checkIn ? new Date(req.body.checkIn) : null,
          checkOut: req.body.checkOut ? new Date(req.body.checkOut) : null,
        },
      }
    );
    return res.json({
      message: "Appointment has been updated successfully",
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

appointmentsRouter.delete("/:id", (req, res) => {});
