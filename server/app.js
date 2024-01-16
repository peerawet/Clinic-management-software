import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { appointmentsRouter } from "./routers/appointmentsRouter.js";
import { patientsRouter } from "./routers/patientsRouter.js";
import { beingTreatedRouter } from "./routers/beingTreatedRouter.js";
import { doctorsRouter } from "./routers/doctorsRouter.js";
import { client } from "./utils/db.js";

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
  app.use("/beingTreated", beingTreatedRouter);
  app.use("/doctors", doctorsRouter);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

init();
