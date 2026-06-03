import db from "../config/db.js";

const getExpenseHistory = async (userId) => {
  const query = `
    SELECT
      total_harga,
      transaction_date
    FROM transaksi
    WHERE id_user = $1
      AND tipe = 'pengeluaran'
    ORDER BY transaction_date DESC
    LIMIT 30
  `;

  const result = await db.query(query, [userId]);

  return result.rows;
};

const getLastMonthExpense = async (userId) => {
  const query = `
    SELECT
      COALESCE(SUM(total_harga), 0)::float
        AS total
    FROM transaksi
    WHERE id_user = $1
      AND tipe = 'pengeluaran'
      AND DATE_TRUNC(
        'month',
        transaction_date
      ) = DATE_TRUNC(
        'month',
        CURRENT_DATE - INTERVAL '1 month'
      )
  `;

  const result = await db.query(query, [userId]);

  return Number(result.rows[0].total);
};

export default {
  getExpenseHistory,
  getLastMonthExpense,
};