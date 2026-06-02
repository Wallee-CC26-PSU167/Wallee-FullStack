import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async ({ nama, email, password }) => {
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
    `INSERT INTO users (nama, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id_user, nama, email`,
    [nama, email, hashedPassword]
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
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Wrong password");
  }
  // generate token
  const token = jwt.sign(
    { id: user.id_user, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id_user,
      nama: user.nama,
      email: user.email,
    },
  };
};

export default {
  register,
  login,
};