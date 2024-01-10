import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { appointmentsRouter } from "./routers/appointmentsRouter.js";
import { patientsRouter } from "./routers/patientsRouter.js";
import { beingTreatedRouter } from "./routers/beingTreatedRouter.js";
import { doctorsRouter } from "./routers/doctorsRouter.js";

const app = express();
const port = 2001;

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
  console.log(`Example app listening on port ${port}`);
});
