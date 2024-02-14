import { Router } from "express";
import { db } from "../utils/db.js";

export const branchsRouter = Router();

branchsRouter.get("/", async (req, res) => {
  const collection = db.collection("branchs");

  try {
    const branchs = await collection.find({}).toArray();

    if (branchs.length === 0) {
      return res.status(404).json({
        error: "No branchs found",
      });
    }

    return res.json({
      data: branchs,
    });
  } catch (error) {
    console.error("Error retrieving branchs", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

branchsRouter.get("/:id", async (req, res) => {
  const branchId = req.params.id;

  const collection = db.collection("branchs");

  try {
    const branch = await collection.findOne({ _id: branchId });

    if (!branch) {
      return res.status(404).json({
        error: "Branch not found",
      });
    }

    return res.json({
      data: branch,
    });
  } catch (error) {
    console.error("Error retrieving branch by ID", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

branchsRouter.post("/", async (req, res) => {
  const collection = db.collection("branchs");

  try {
    await collection.insertOne(req.body);

    return res.status(201).json({
      message: "Branch created successfully",
    });
  } catch (error) {
    console.error("Error creating branch", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});
