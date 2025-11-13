
// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

let db;

// Connect to MongoDB Atlas
async function connectMongo() {
  try {
    const client = new MongoClient(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    db = client.db(); // Database name from URI
    console.log("✅ Connected to MongoDB Atlas!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

// Create default player if not exists
async function createPlayerIfNotExists(playerId) {
  const existing = await db.collection("players").findOne({ id: playerId });
  if (!existing) {
    await db.collection("players").insertOne({
      id: playerId,
      tokens: 1000,
      hp: 200,
      mp: 50,
      enemyHp: 200,
      enemyMp: 50,
      enemyMaxHP: 200,
      enemyMaxMP: 50,
      enemyIQ: 0,
      attackUpgrade: 0,
      specialUpgrade: 0
    });
    console.log(`✅ Created default player: ${playerId}`);
  }
}

// Routes
app.get("/", (req, res) => res.send("RPG Server is running!"));

// Get all players
app.get("/players", async (req, res) => {
  try {
    const players = await db.collection("players").find().toArray();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

// Get single player by ID
app.get("/players/:id", async (req, res) => {
  const playerId = req.params.id;

  try {
    const player = await db.collection("players").findOne({ id: playerId });

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json(player);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch player" });
  }
});

// Update or create player stats
app.post("/players/:id", async (req, res) => {
  const playerId = req.params.id;
  const updateData = req.body;

  try {
    const result = await db.collection("players").updateOne(
      { id: playerId },
      { $set: updateData },
      { upsert: true } // Creates the document if it doesn't exist
    );

    res.json({ success: true, updated: updateData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update player" });
  }
});

// Start server after MongoDB connection and create default player
connectMongo().then(async () => {
  await createPlayerIfNotExists("player123");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});