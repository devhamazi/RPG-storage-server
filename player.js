
// createPlayer.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Player from "./models/Player.js"; // Adjust path to your Player model

dotenv.config();

// Use same DB connection as your app
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

async function createPlayer() {
  const existing = await Player.findOne({ playerId: "player123" });
  if (existing) {
    console.log("Player already exists:", existing);
    process.exit(0);
  }

  const player = new Player({
    playerId: "player123",
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

  await player.save();
  console.log("Player created successfully:", player);
  process.exit(0);
}

createPlayer();
