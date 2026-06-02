import bcrypt from "bcrypt";
import db from "../config/db.js";

const getProfile = async (userId) => {
  const result = await db.query(
    'SELECT id_user, nama, email, created_at FROM users WHERE id_user = $1',
    [userId]
  );
  if (!result.rows.length) throw new Error('User not found');
  return result.rows[0];
};

const updateProfile = async (userId, { nama, email, currentPassword, newPassword }) => {
  // Ambil data user dulu
  const userResult = await db.query('SELECT * FROM users WHERE id_user = $1', [userId]);
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
      'SELECT id_user FROM users WHERE email = $1 AND id_user != $2',
      [email, userId]
    );
    if (existing.rows.length) throw new Error('Email already in use');
  }

  // Bangun SET clause dinamis
  const setClauses = [];
  const params = [];
  let i = 1;

  if (nama) { setClauses.push(`nama = $${i++}`); params.push(nama); }
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
     WHERE id_user = $${i}
     RETURNING id_user, nama, email, created_at`,
    params
  );

  return result.rows[0];
};

export default { getProfile, updateProfile };