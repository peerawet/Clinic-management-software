import { Router } from "express";
import { db } from "../utils/db.js";

export const treatmentsRouter = Router();

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
