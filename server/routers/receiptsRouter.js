import { Router } from "express";
import { db } from "../utils/db.js";

export const receiptsRouter = Router();

receiptsRouter.post("/", async (req, res) => {
  const collection = db.collection("receipts");
  try {
    await collection.insertOne({
      ...req.body,
      created: new Date(req.body.created),
    });
    return res.json({
      message: "Receipt has been created successfully",
    });
  } catch (error) {
    console.error("Error created receipt", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

receiptsRouter.get("/appointment/:id", async (req, res) => {
  const collection = db.collection("receipts");

  try {
    const appointment_id = req.params.id;

    const receipts = await collection
      .find({ appointment_id: appointment_id })
      .toArray();

    return res.json({
      data: receipts,
      message: "Receipts retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving receipts", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});
