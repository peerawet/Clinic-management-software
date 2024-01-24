import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { client } from "./utils/db.js";
import { appointmentsRouter } from "./routers/appointmentsRouter.js";
import { patientsRouter } from "./routers/patientsRouter.js";
import { doctorsRouter } from "./routers/doctorsRouter.js";
import { receiptsRouter } from "./routers/receiptsRouter.js";
import { treatmentsRouter } from "./routers/treatmentsRouter.js";
import { receipts_treatmentsRouter } from "./routers/receipts_treatmentsRouter.js";
import { coursesRouter } from "./routers/coursesRouter.js";
import { courses_patientsRouter } from "./routers/courses_patientsRouter.js";
import { branchsRouter } from "./routers/branchsRouter.js";

async function init() {
  const app = express();
  const port = 2001;

  try {
    await client.connect();
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  app.use(cors());
  app.use(bodyParser.json());

  app.use("/appointments", appointmentsRouter);
  app.use("/patients", patientsRouter);
  app.use("/doctors", doctorsRouter);
  app.use("/receipts", receiptsRouter);
  app.use("/treatments", treatmentsRouter);
  app.use("/receipts_treatments", receipts_treatmentsRouter);
  app.use("/courses", coursesRouter);
  app.use("/courses_patients", courses_patientsRouter);
  app.use("/branchs", branchsRouter);

  app.get("/", (req, res) => {
    res.send("Clinic Mangement Software");
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

init();
