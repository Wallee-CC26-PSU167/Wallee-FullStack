import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"
import profileRoutes from "./routes/ProfileRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import categoriRoutes from "./routes/categoriRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoriRoutes);
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

// 404 Handler - untuk route yang tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    data: null
  });
});