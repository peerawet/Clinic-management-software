import { Router } from "express";
import { db } from "../utils/db.js";

export const doctorsRouter = Router();
// Doctors endpoints
doctorsRouter.get("/", async (req, res) => {
  const collection = db.collection("doctors");

  try {
    const doctors = await collection.find({}).toArray();

    if (doctors.length === 0) {
      return res.status(404).json({
        error: "No doctors found",
      });
    }

    return res.json({
      data: doctors,
    });
  } catch (error) {
    console.error("Error retrieving doctors", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

doctorsRouter.get("/:_id", async (req, res) => {
  const collection = db.collection("doctors");
  const doctor = await collection.findOne({ _id: req.params._id });

  if (doctor) {
    res.json({ data: doctor });
  } else {
    res.status(404).json({ error: "Doctor not found" });
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

doctorsRouter.post("/", async (req, res) => {
  const collection = db.collection("doctors");

  try {
    await collection.insertOne(req.body);

    return res.status(201).json({
      message: "Doctor created successfully",
    });
  } catch (error) {
    console.error("Error creating doctor", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

doctorsRouter.put("/:id", async (req, res) => {
  const collection = db.collection("doctors");
  const doctorId = req.params.id;
  const { name, branch, picture } = req.body;

  const updatedDoctor = {
    name,
    branch,
    picture,
  };

  try {
    const result = await collection.updateOne(
      { _id: doctorId },
      { $set: updatedDoctor }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: "Doctor not found",
      });
    }

    return res.status(200).json({
      message: "Doctor updated successfully",
    });
  } catch (error) {
    console.error("Error updating doctor", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

doctorsRouter.get("/branch/:branch_id", async (req, res) => {
  const collection = db.collection("doctors");

  try {
    const doctors = await collection
      .find({ branch: req.params.branch_id })
      .toArray();

    if (doctors.length > 0) {
      res.json({ data: doctors });
    } else {
      res
        .status(404)
        .json({ error: "Doctors not found for the specified branch" });
    }
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
