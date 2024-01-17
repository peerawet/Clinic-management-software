import { MongoClient } from "mongodb";

const connectionString = "mongodb://127.0.0.1:27017";

console.log("------- Start connecting to MongoDB -------");
export const client = new MongoClient(connectionString);

await client.connect();
console.log("------- Connected to MongoDB Successfully -------");

export const db = client.db("clinic-management-software");
console.log("------- Using database 'clinic management software' -------");
