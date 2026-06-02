// utils/cache.js
import redis from "../config/redis.js";

const DEFAULT_TTL = 60 * 5; // 5 menit

// ── Get ───────────────────────────────────────────────────────
export const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("[Cache] getCache error:", err.message);
    return null; // fallback ke database jika Redis error
  }
};

// ── Set ───────────────────────────────────────────────────────
export const setCache = async (key, value, ttl = DEFAULT_TTL) => {
  try {
    await redis.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    console.error("[Cache] setCache error:", err.message);
    // tidak throw — Redis error tidak boleh break aplikasi
  }
};

// ── Delete satu key ───────────────────────────────────────────
export const deleteCache = async (key) => {
  try {
    await redis.del(key);
  } catch (err) {
    console.error("[Cache] deleteCache error:", err.message);
  }
};

// ── Delete banyak key berdasarkan pattern ─────────────────────
// Contoh: deletePattern("transactions:all:123:*")
export const deletePattern = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
      console.log(`[Cache] Deleted ${keys.length} keys matching: ${pattern}`);
    }
  } catch (err) {
    console.error("[Cache] deletePattern error:", err.message);
  }
};

// ── Invalidate semua cache milik satu user ───────────────────
export const invalidateUserCache = async (userId) => {
  await Promise.all([
    deletePattern(`transactions:all:${userId}:*`),
    deleteCache(`transactions:analytics:${userId}`),
    deletePattern(`transactions:summary:${userId}:*`),
  ]);
};