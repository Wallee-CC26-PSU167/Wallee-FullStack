import transaksiRepository from "../repositories/transactionRepository.js";
import db from "../config/db.js";

const getAll = async (userId, query) => {
  return await transaksiRepository.findAll(
    userId,
    query
  );
};

const getById = async (id, userId) => {
  return await transaksiRepository.findById(
    id,
    userId
  );
};

const create = async (userId, payload) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    let total_harga = 0;
    /*
    |--------------------------------------------------------------------------
    | EXPENSE
    |--------------------------------------------------------------------------
    */
    if (payload.type === "expense") {
      if (!payload.items?.length) {
        throw new Error(
          "Items wajib untuk transaksi pengeluaran"
        );
      }
      for (const item of payload.items) {
        total_harga += item.price * item.qty;
      }
    }
    /*
    |--------------------------------------------------------------------------
    | INCOME
    |--------------------------------------------------------------------------
    */
    if (payload.type === "income") {
      total_harga = payload.amount;
    }
    /*
    |--------------------------------------------------------------------------
    | CREATE TRANSACTION
    |--------------------------------------------------------------------------
    */
    const transaksi =
  await transaksiRepository.createTransaction(
    client,
    {
      id_user: userId,
      // income punya kategori
      id_kategori:
        payload.type === "income"
          ? payload.category_id
          : null,
      total_harga,
      tipe:
        payload.type === "income"
          ? "pemasukan"
          : "pengeluaran",
      merchant:
        payload.description,
      transaction_date:
        payload.date,
      transaction_time:
        payload.time,
    }
  );
    /*
    |--------------------------------------------------------------------------
    | CREATE ITEMS ONLY FOR EXPENSE
    |--------------------------------------------------------------------------
    */
    let items = [];

    if (payload.type === "expense") {
      items =
        await transaksiRepository.createTransactionItems(
          client,
          payload.items.map((item) => ({
            id_kategori:
              item.category_id,
            nama_item:
              item.name,
            harga:
              item.price,
            qty:
              item.qty,
          })),
          transaksi.id_transaksi
        );
    }
    await client.query("COMMIT");
    return {
      ...transaksi,
      items,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
const remove = async (id, userId) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await transaksiRepository.deleteTransactionItems(
      client,
      id
    );
    const deleted =
      await transaksiRepository.deleteTransaction(
        client,
        id,
        userId
      );
    if (!deleted) {
      throw new Error(
        "Data Transaksi tidak ditemukan"
      );
    }
    await client.query("COMMIT");

    return deleted;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
const getSummary = async (
  userId,
  { month, year }
) => {
  const result =
    await transaksiRepository.getSummary(
      userId,
      { month, year }
    );
  let total_pemasukan = 0;
  let total_pengeluaran = 0;

  for (const row of result.summary) {
    if (row.tipe === "pemasukan") {
      total_pemasukan = Number(row.total);
    }
    if (row.tipe === "pengeluaran") {
      total_pengeluaran = Number(row.total);
    }
  }

  return {
    month: Number(month),
    year: Number(year),
    total_pemasukan,
    total_pengeluaran,
    balance:
      total_pemasukan -
      total_pengeluaran,
    total_transaksi:
      result.total_transaksi,
  };
};
const getAnalyticsTransactions = async (
  userId
) => {
  return await transaksiRepository
    .getAnalyticsTransactions(userId);
};

export default {
  getAll,
  getById,
  create,
  remove,
  getSummary,
  getAnalyticsTransactions,
};