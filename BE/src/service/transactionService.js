// service/transactionService.js
import transaksiRepository from "../repositories/transactionRepository.js";
import db from "../config/db.js";
import {
  getCache,
  setCache,
  invalidateUserCache,
} from "../utils/cache.js";

// ── TTL per fungsi ────────────────────────────────────────────
const TTL = {
  ALL:       60 * 60 * 6,   // 6 jam  — list transaksi
  ANALYTICS: 60 * 60 * 6,   // 6 jam  — query paling berat
  SUMMARY:   60 * 60 * 6,  // 6 jam — summary dashboard
};

// ── getAll ────────────────────────────────────────────────────
const getAll = async (userId, query) => {
  // Cache key unik per user + kombinasi query params
  const cacheKey = `transactions:all:${userId}:${JSON.stringify(query)}`;

  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }
  const result = await transaksiRepository.findAll(userId, query);
  await setCache(cacheKey, result, TTL.ALL);
  return result;
};

// ── getById ───────────────────────────────────────────────────
// Tidak di-cache — dipanggil jarang dan butuh data fresh
const getById = async (id, userId) => {
  return await transaksiRepository.findById(id, userId);
};

// ── create ────────────────────────────────────────────────────
const create = async (userId, payload) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    let total_harga = 0;

    if (payload.type === "expense") {
      if (!payload.items?.length) {
        throw new Error("Items wajib untuk transaksi pengeluaran");
      }
      for (const item of payload.items) {
        total_harga += item.price * item.qty;
      }
    }

    if (payload.type === "income") {
      total_harga = payload.amount;
    }

    const transaksi = await transaksiRepository.createTransaction(client, {
      id_user:          userId,
      id_kategori:      payload.type === "income" ? payload.category_id : null,
      total_harga,
      tipe:             payload.type === "income" ? "pemasukan" : "pengeluaran",
      merchant:         payload.description,
      transaction_date: payload.date,
      transaction_time: payload.time,
    });

    let items = [];
    if (payload.type === "expense") {
      items = await transaksiRepository.createTransactionItems(
        client,
        payload.items.map((item) => ({
          id_kategori: item.category_id,
          nama_item:   item.name,
          harga:       item.price,
          qty:         item.qty,
        })),
        transaksi.id_transaksi
      );
    }

    await client.query("COMMIT");

    // ── Invalidate cache setelah data baru masuk ──────────────
    await invalidateUserCache(userId);
    console.log(`[Cache] Invalidated for user ${userId} after create`);

    return { ...transaksi, items };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// ── remove ────────────────────────────────────────────────────
const remove = async (id, userId) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    await transaksiRepository.deleteTransactionItems(client, id);

    const deleted = await transaksiRepository.deleteTransaction(client, id, userId);
    if (!deleted) throw new Error("Data Transaksi tidak ditemukan");

    await client.query("COMMIT");

    // ── Invalidate cache setelah data dihapus ─────────────────
    await invalidateUserCache(userId);
    console.log(`[Cache] Invalidated for user ${userId} after delete`);

    return deleted;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// ── getSummary ────────────────────────────────────────────────
const getSummary = async (userId, { month, year }) => {
  const cacheKey = `transactions:summary:${userId}:${year}:${month}`;

  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }
  const result = await transaksiRepository.getSummary(userId, { month, year });

  let total_pemasukan  = 0;
  let total_pengeluaran = 0;

  for (const row of result.summary) {
    if (row.tipe === "pemasukan")   total_pemasukan   = Number(row.total);
    if (row.tipe === "pengeluaran") total_pengeluaran = Number(row.total);
  }

  const summary = {
    month:             Number(month),
    year:              Number(year),
    total_pemasukan,
    total_pengeluaran,
    balance:           total_pemasukan - total_pengeluaran,
    total_transaksi:   result.total_transaksi,
  };

  await setCache(cacheKey, summary, TTL.SUMMARY);
  return summary;
};

// ── getAnalyticsTransactions ──────────────────────────────────
const getAnalyticsTransactions = async (userId) => {
  const cacheKey = `transactions:analytics:${userId}`;

  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }
  const result = await transaksiRepository.getAnalyticsTransactions(userId);
  await setCache(cacheKey, result, TTL.ANALYTICS);
  return result;
};

export default {
  getAll,
  getById,
  create,
  remove,
  getSummary,
  getAnalyticsTransactions,
};