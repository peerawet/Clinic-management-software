import { Router } from "express";
import { db } from "../utils/db.js";

export const doctorsRouter = Router();
// Doctors endpoints
doctorsRouter.get("/", (req, res) => {});

doctorsRouter.get("/:_id", async (req, res) => {
  const collection = db.collection("doctors");
  const doctor = await collection.findOne({ _id: req.params._id });

  if (doctor) {
    res.json({ data: doctor });
  } else {
    res.status(404).json({ error: "Patient not found" });
  }
});

const findBookedDoctors = async (startTimeStamp, endTimeStamp, branch) => {
  const appointmentsCollection = db.collection("appointments");

  const startDateTime = new Date(Number(startTimeStamp));
  const endDateTime = new Date(Number(endTimeStamp));

  const bookedAppointments = await appointmentsCollection
    .find({
      branch: branch,
      start: {
        $gte: startDateTime,
        $lt: endDateTime,
      },
    })
    .toArray();

  const bookedDoctors = bookedAppointments.map(
    (appointment) => appointment.license
  );

  return bookedDoctors;
};

doctorsRouter.get("/available/:branch", async (req, res) => {
  try {
    const branch = req.params.branch.toUpperCase();
    const startTimeStamp = req.query.startTimeStamp;
    const endTimeStamp = req.query.endTimeStamp;

    if (!startTimeStamp || !endTimeStamp) {
      return res.status(400).json({
        error:
          "Both startTimeStamp and endTimeStamp are required as query parameters.",
      });
    }

    const bookedDoctors = await findBookedDoctors(
      startTimeStamp,
      endTimeStamp,
      branch
    );
    const doctorsCollection = db.collection("doctors");
    const allDoctors = await doctorsCollection.find({ branch }).toArray();

    const availableDoctors = allDoctors.filter(
      (doctor) => !bookedDoctors.includes(doctor._id)
    );

    res.json({ data: availableDoctors });
  } catch (error) {
    console.error("Error in doctorsRouter:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

doctorsRouter.post("/", (req, res) => {});

doctorsRouter.put("/:license", (req, res) => {});

doctorsRouter.delete("/:license", (req, res) => {});
