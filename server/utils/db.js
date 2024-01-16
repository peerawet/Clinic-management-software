import { MongoClient } from "mongodb";
import patients from "../data/patients.js";
import doctors from "../data/doctors.js";
import appointments from "../data/appointments.js";

const connectionString = "mongodb://127.0.0.1:27017";

console.log("------- Start connecting to MongoDB -------");
export const client = new MongoClient(connectionString, {
  useUnifiedTopology: true,
});

await client.connect();
console.log("------- Connected to MongoDB Successfully -------");

export const db = client.db("clinic-management-software");
console.log("------- Using database 'clinic management software' -------");

// const collections = ["patients", "doctors", "appointments", "receipts"];

// for (const collectionName of collections) {
//   try {
//     await db.createCollection(collectionName);
//     console.log(
//       `------- Created collection '${collectionName}' successfully -------`
//     );
//   } catch (error) {
//     console.log(`Collection '${collectionName}' already exists!`);
//   }
// }

// const patientsCollection = db.collection("patients");
// const doctorsCollection = db.collection("doctors");
// const appointmentsCollection = db.collection("appointments");

// await patientsCollection.insertMany(patients);
// console.log("------- Insert patients successfully -------");

// await doctorsCollection.insertMany(doctors);
// console.log("------- Insert doctors successfully -------");

// await appointmentsCollection.insertMany(
//   appointments.map((appointment) => {
//     return {
//       ...appointment,
//       start: new Date(appointment.start),
//       end: new Date(appointment.end),
//     };
//   })
// );
// console.log("------- Insert appointments successfully -------");
