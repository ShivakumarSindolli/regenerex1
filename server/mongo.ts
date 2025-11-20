import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectMongo(uri: string, dbName = "regenerex") {
  if (client) return db as Db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  console.log("Connected to MongoDB", uri, dbName);
  return db;
}

export async function getDb() {
  if (!db) throw new Error("MongoDB not connected");
  return db;
}

export async function closeMongo() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
