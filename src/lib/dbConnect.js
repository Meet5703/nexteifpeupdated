import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://meetkhetani:mvm%402003@cluster0.9lwhdrj.mongodb.net/test?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cachedDb = null;

export async function dbConnect() {
  if (cachedDb) {
    return cachedDb;
  }

  const db = await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  cachedDb = db;
  return db;
}

export default dbConnect;
