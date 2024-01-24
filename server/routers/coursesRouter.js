import { Router } from "express";
import { db } from "../utils/db.js";

export const coursesRouter = Router();

coursesRouter.get("/", async (req, res) => {
  const collection = db.collection("courses");

  try {
    const courses = await collection.find({}).toArray();

    return res.json({
      data: courses,
      message: "courses retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving courses", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

coursesRouter.get("/:id", async (req, res) => {
  const collection = db.collection("courses");
  const id = req.params.id;

  try {
    const course = await collection.findOne({ _id: id });

    if (course) {
      return res.json({
        data: course,
        message: "Course retrieved successfully",
      });
    } else {
      return res.status(404).json({
        message: "Course not found",
      });
    }
  } catch (error) {
    console.error("Error retrieving course by ID", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

coursesRouter.put("/:id", async (req, res) => {
  const collection = db.collection("courses");
  const courseId = req.params.id;

  try {
    const existingCourse = await collection.findOne({ _id: courseId });

    if (!existingCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    await collection.updateOne({ _id: courseId }, { $set: req.body });

    return res.json({
      message: "Course updated successfully",
    });
  } catch (error) {
    console.error("Error updating course by ID", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});
