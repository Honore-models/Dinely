import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB || "dinely";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local",
  );
}

// Reuse connection across hot reloads in development
declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(MONGODB_URI);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(MONGODB_URI);
}

export async function getDb(): Promise<Db> {
  if (!client.connect) {
    await client.connect();
  }
  // connect() is idempotent – safe to call every time
  await client.connect();
  return client.db(DB_NAME);
}

export { client };
