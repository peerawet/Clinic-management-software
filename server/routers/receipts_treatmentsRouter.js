import { Router } from "express";
import { db } from "../utils/db.js";

export const receipts_treatmentsRouter = Router();

receipts_treatmentsRouter.post("/", async (req, res) => {
  const collection = db.collection("receipts_treatments");
  try {
    await collection.insertOne({ ...req.body });
    return res.json({
      message: "receipts_treatments has been created successfully",
    });
  } catch (error) {
    console.error("Error created receipt", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

receipts_treatmentsRouter.get("/receipt/:id", async (req, res) => {
  const collection = db.collection("receipts_treatments");

  try {
    const receipt_id = req.params.id;
    const receiptsTreatments = await collection
      .find({ receipt_id: receipt_id })
      .toArray();

    return res.json({
      data: receiptsTreatments,
      message: "Receipts treatments retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving receipts treatments", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

receipts_treatmentsRouter.get(
  "/find_by_appointment_id/:appointmentId",
  async (req, res) => {
    const collectionReceipts = db.collection("receipts");
    const collectionReceipts_Treatments = db.collection("receipts_treatments");

    try {
      const appointmentId = req.params.appointmentId;

      // Find the receipt related to the appointment_id
      const receipt = await collectionReceipts.findOne({
        appointment_id: appointmentId,
      });

      if (!receipt) {
        return res.status(404).json({
          error: "No receipt found for the given appointment ID",
        });
      }

      // Find treatments related to the receipt using the receipt ID
      const treatments = await collectionReceipts_Treatments
        .find({
          receipt_id: receipt._id,
        })
        .toArray();

      return res.json({
        data: treatments,
      });
    } catch (error) {
      console.error("Error retrieving receipt and treatments", error);
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);
