import { Router } from "express";
import { db } from "../utils/db.js";

export const treatmentsRouter = Router();

treatmentsRouter.put("/:id", async (req, res) => {
  const collection = db.collection("treatments");
  const treatmentId = req.params.id;

  // Extract the updated data from the request body
  const { name, allow, details } = req.body;

  if (!name || !allow || !details) {
    return res.status(400).json({
      error: "Incomplete data. Please provide name, allow, and details.",
    });
  }

  const updatedTreatment = {
    name,
    allow,
    details,
  };

  try {
    await collection.updateOne(
      { _id: treatmentId },
      { $set: updatedTreatment }
    );

    return res.status(200).json({
      message: "Treatment updated successfully",
    });
  } catch (error) {
    console.error("Error updating treatment", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

treatmentsRouter.get("/", async (req, res) => {
  const collection = db.collection("treatments");

  try {
    const treatments = await collection.find({}).toArray();

    if (treatments.length === 0) {
      return res.status(404).json({
        error: "No treatments found",
      });
    }

    return res.json({
      data: treatments,
    });
  } catch (error) {
    console.error("Error retrieving treatments", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

treatmentsRouter.post("/", async (req, res) => {
  const collection = db.collection("treatments");

  const { name, _id, allow, details } = req.body;

  if (!name || !_id || !allow || !details) {
    return res.status(400).json({
      error: "Incomplete data. Please provide name, id, allow, and details.",
    });
  }

  const newTreatment = {
    name,
    _id,
    allow,
    details,
  };

  try {
    await collection.insertOne(newTreatment);

    return res.status(201).json({
      message: "Treatment created successfully",
      data: newTreatment,
    });
  } catch (error) {
    console.error("Error creating treatment", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});
