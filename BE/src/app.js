import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"
import profileRoutes from "./routes/ProfileRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
dotenv.config();

app.get("/", (req, res) => {
  res.send("API Wallee jalan");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import pool from "./config/db.js";

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

import authMiddleware from "./middleware/authMiddleware.js";

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Kamu berhasil masuk",
    user: req.user,
  });
});