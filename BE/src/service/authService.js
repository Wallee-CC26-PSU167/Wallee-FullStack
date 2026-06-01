import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const register = async ({ name, email, password }) => {
  // cek user sudah ada
  const existing = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existing.rows.length > 0) {
    throw new Error("Email already used");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // insert user
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
    [name, email, hashedPassword]
  );

  return result.rows[0];
};

const login = async ({ email, password }) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error("Wrong password");
  }

  // generate token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

const forgotPassword = async ({ email }) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = result.rows[0];

  if (!user) {
    throw new Error("User with that email does not exist");
  }

  // Membuat token sekali pakai dengan secret yang gabungan dari JWT_SECRET + password lama user.
  // Jika password diubah, token ini otomatis tidak valid.
  const secret = process.env.JWT_SECRET + user.password_hash;
  const token = jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: "15m", // Token kedaluwarsa dalam 15 menit
  });

  // Mengambil URL Frontend dari .env, atau gunakan localhost jika belum diatur
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const link = `${frontendUrl}/reset-password?id=${user.id}&token=${token}`;

  // Menggunakan Nodemailer dengan Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Pastikan ini diisi dengan App Password Gmail (bukan password login biasa)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Reset Password Wallee",
    html: `
      <h2>Halo, ${user.name}</h2>
      <p>Kamu menerima email ini karena ada permintaan untuk mereset password akun Wallee kamu.</p>
      <p>Silakan klik link di bawah ini untuk mereset password. Link ini hanya berlaku selama 15 menit.</p>
      <a href="${link}" style="display:inline-block; padding:10px 20px; background-color:#818cf8; color:#fff; text-decoration:none; border-radius:5px;">Reset Password Sekarang</a>
      <p>Jika kamu tidak pernah meminta reset password, abaikan saja email ini.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  return { message: "Email reset password telah dikirim" };
};

const resetPassword = async ({ id, token, newPassword }) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const secret = process.env.JWT_SECRET + user.password_hash;
  
  try {
    // Memverifikasi apakah token masih valid dan belum digunakan
    jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Link reset password tidak valid atau sudah kedaluwarsa");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await pool.query(
    "UPDATE users SET password_hash = $1 WHERE id = $2",
    [hashedPassword, id]
  );

  return { message: "Password berhasil diubah, silakan login dengan password baru" };
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
};