import bcrypt from "bcrypt";
import db from "../config/db.js";

const getProfile = async (userId) => {
  const result = await db.query(
    'SELECT id, name, email, created_at FROM users WHERE id = $1',
    [userId]
  );
  if (!result.rows.length) throw new Error('User not found');
  return result.rows[0];
};

const updateProfile = async (userId, { name, email, currentPassword, newPassword }) => {
  // Ambil data user dulu
  const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
  const user = userResult.rows[0];
  if (!user) throw new Error('User not found');

  // Kalau mau ganti password, validasi current password dulu
  if (newPassword) {
    if (!currentPassword) throw new Error('Current password is required');
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) throw new Error('Current password is incorrect');
  }

  // Kalau ganti email, cek apakah email sudah dipakai user lain
  if (email && email !== user.email) {
    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, userId]
    );
    if (existing.rows.length) throw new Error('Email already in use');
  }

  // Bangun SET clause dinamis
  const setClauses = [];
  const params = [];
  let i = 1;

  if (name) { setClauses.push(`name = $${i++}`); params.push(name); }
  if (email) { setClauses.push(`email = $${i++}`); params.push(email); }
  if (newPassword) {
    const hash = await bcrypt.hash(newPassword, 10);
    setClauses.push(`password_hash = $${i++}`);
    params.push(hash);
  }

  if (!setClauses.length) throw new Error('No fields to update');

  params.push(userId);
  const result = await db.query(
    `UPDATE users SET ${setClauses.join(', ')}
     WHERE id = $${i}
     RETURNING id, name, email, created_at`,
    params
  );

  return result.rows[0];
};

export default { getProfile, updateProfile };