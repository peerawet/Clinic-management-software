import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

export const courses_patientsRouter = Router();

courses_patientsRouter.post("/", async (req, res) => {
  const collection = db.collection("courses_patients");

  try {
    await collection.insertOne(req.body);

    return res.json({
      message: "Course patient data inserted successfully",
    });
  } catch (error) {
    console.error("Error inserting course patient data", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

courses_patientsRouter.get("/courses/:patient_id", async (req, res) => {
  const collection = db.collection("courses_patients");
  const _id = req.params.patient_id;

  try {
    const result = await collection.find({ patient_id: _id }).toArray();

    return res.json({
      data: result,
      message: "Course IDs retrieved successfully for the given patient",
    });
  } catch (error) {
    console.error("Error fetching course IDs by patient_id", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

courses_patientsRouter.get("/course-info/:patient_id", async (req, res) => {
  const patient_id = req.params.patient_id;

  try {
    const coursePatientResults = await db
      .collection("courses_patients")
      .find({ patient_id })
      .toArray();

    const result = await Promise.all(
      coursePatientResults.map(async (coursePatient) => {
        const courseInfo = await db
          .collection("courses")
          .findOne({ _id: coursePatient.course_id });

        return {
          ...courseInfo,
          patient_id,
          remaining: coursePatient.remaining,
        };
      })
    );

    return res.json({
      data: result,
      message:
        "Course information retrieved successfully for the given patient",
    });
  } catch (error) {
    console.error("Error fetching course information by patient_id", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

courses_patientsRouter.get("/course-info/:patient_id", async (req, res) => {
  const patient_id = req.params.patient_id;

  try {
    const coursePatientResults = await db
      .collection("courses_patients")
      .find({ patient_id })
      .toArray();

    const result = await Promise.all(
      coursePatientResults.map(async (coursePatient) => {
        const courseInfo = await db
          .collection("courses")
          .findOne({ _id: coursePatient.course_id });

        return {
          ...courseInfo,
          patient_id,
          remaining: coursePatient.remaining,
        };
      })
    );

    return res.json({
      data: result,
      message:
        "Course information retrieved successfully for the given patient",
    });
  } catch (error) {
    console.error("Error fetching course information by patient_id", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

courses_patientsRouter.put("/:id", async (req, res) => {
  const courseId = req.params.id;
  const { remaining } = req.body;

  try {
    // Check if the course_patient record exists
    const coursePatient = await db
      .collection("courses_patients")
      .findOne({ _id: ObjectId(courseId) });

    if (!coursePatient) {
      return res.status(404).json({
        error: "Course information not found for the given id",
      });
    }

    // Update the remaining value
    await db.collection("courses_patients").updateOne(
      { _id: ObjectId(courseId) },
      {
        $set: {
          remaining: remaining,
        },
      }
    );

    return res.json({
      message: "Course information updated successfully",
    });
  } catch (error) {
    console.error("Error updating course information", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});
