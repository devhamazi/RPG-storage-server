// index.js
import express from "express";
import { MongoClient } from "mongodb";

// === Ensure environment variable is set ===
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ Error: MONGO_URI environment variable is not set");
  process.exit(1);
}

// === Create Express app ===
const app = express();
app.use(express.json());

// === Connect to MongoDB ===
let dbClient;
async function connectMongo() {
  try {
    dbClient = new MongoClient(mongoUri);
    await dbClient.connect();
    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

// === Simple test route ===
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// === Start server after MongoDB connects ===
const PORT = process.env.PORT || 3000;
connectMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
});