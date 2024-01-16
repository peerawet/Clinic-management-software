import { Router } from "express";
import { db } from "../utils/db.js";

export const patientsRouter = Router();

patientsRouter.get("/", async (req, res) => {
  const collection = db.collection("patients");
  const result = await collection.find({}).toArray();
  return res.json({ data: result });
});

patientsRouter.get("/:_id", async (req, res) => {
  const collection = db.collection("patients");
  const patient = await collection.findOne({ _id: req.params._id });

  if (patient) {
    res.json({ data: patient });
  } else {
    res.status(404).json({ error: "Patient not found" });
  }
});

const generateId = async (branch) => {
  try {
    const patientsCollection = db.collection("patients");

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so add 1

    // Find the latest document for the specific branch in the current year and month
    const latestPatient = await patientsCollection.findOne(
      {
        branch: branch,
        _id: {
          $regex: `${branch}${currentYear.toString().slice(2)}${currentMonth
            .toString()
            .padStart(2, "0")}`,
        },
      },
      { sort: { _id: -1 } }
    );

    // Extract the latest run number and increment it
    let latestRunNumber = 0;
    if (latestPatient) {
      const runNumber = parseInt(latestPatient._id.slice(-3)); // Extract the last 3 digits
      latestRunNumber = runNumber;
    }

    // Generate the new ID based on your logic and include the branch, year, and month
    const newRunNumber = latestRunNumber + 1;
    const newId = `${branch}${currentYear.toString().slice(2)}${currentMonth
      .toString()
      .padStart(2, "0")}${newRunNumber.toString().padStart(3, "0")}`;

    return newId;
  } catch (error) {
    console.error("Error generating ID:", error);
    throw error;
  }
};

patientsRouter.post("/:branch", async (req, res) => {
  const branch = req.params.branch.toUpperCase();

  try {
    const newId = await generateId(branch);
    const collection = db.collection("patients");
    await collection.insertOne({ ...req.body, _id: newId, branch: branch });
    res.json({
      message: "Patient has been created.",
      data: newId,
    });
  } catch (error) {
    console.error("Error creating patient:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

patientsRouter.put("/:hn", (req, res) => {});

patientsRouter.delete("/:hn", (req, res) => {});
