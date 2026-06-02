import db from "../config/db.js";

const findAll = async (
  userId,
  {
    startDate,
    endDate,
    page = 1,
    limit = 10,
  }
) => {
  const conditions = ["t.id_user = $1"];
  const params = [userId];
  let i = 2;

  if (startDate) {
    conditions.push(
      `t.transaction_date >= $${i++}`
    );

    params.push(startDate);
  }
  if (endDate) {
    conditions.push(
      `t.transaction_date <= $${i++}`
    );

    params.push(endDate);
  }

  const where = conditions.join(" AND ");
  const offset =
    (Number(page) - 1) * Number(limit);
  const query = `
    SELECT
      t.id_transaksi,
      t.id_user,
      t.total_harga,
      t.tipe,
      t.merchant,
      t.transaction_date,
      t.transaction_time,
      t.created_at,
      COUNT(it.id_item_transaksi)::int
        AS item_count
    FROM transaksi t
    LEFT JOIN item_transaksi it
      ON t.id_transaksi = it.id_transaksi
    WHERE ${where}
    GROUP BY t.id_transaksi
    ORDER BY
      t.transaction_date DESC,
      t.transaction_time DESC
    LIMIT $${i++}
    OFFSET $${i++}
  `;
  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM transaksi t
    WHERE ${where}
  `;
  const [rows, count] = await Promise.all([
    db.query(query, [
      ...params,
      Number(limit),
      offset,
    ]),

    db.query(countQuery, params),
  ]);

  return {
    transactions: rows.rows,
    pagination: {
      total: count.rows[0].total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(
        count.rows[0].total / limit
      ),
    },
  };
};
const findById = async (id, userId) => {
  const trxResult = await db.query(
    `
      SELECT
        id_transaksi,
        id_user,
        total_harga,
        tipe,
        merchant,
        transaction_date,
        transaction_time,
        created_at
      FROM transaksi
      WHERE id_transaksi = $1
        AND id_user = $2
    `,
    [id, userId]
  );
  if (!trxResult.rows.length) {
    return null;
  }
  const itemResult = await db.query(
    `
      SELECT
        it.id_item_transaksi,
        it.id_kategori,
        k.nama AS nama_kategori,
        k.type,
        it.nama_item,
        it.harga,
        it.qty,
        it.subtotal
      FROM item_transaksi it
      LEFT JOIN kategori k
        ON it.id_kategori = k.id_kategori
      WHERE it.id_transaksi = $1
      ORDER BY it.id_item_transaksi ASC
    `,
    [id]
  );
  return {
    ...trxResult.rows[0],
    items: itemResult.rows,
  };
};
const createTransaction = async (
  client,
  {
    id_user,
    id_kategori,
    total_harga,
    tipe,
    merchant,
    transaction_date,
    transaction_time,
  }
) => {

  const result = await client.query(
    `
    INSERT INTO transaksi (
      id_user,
      id_kategori,
      total_harga,
      tipe,
      merchant,
      transaction_date,
      transaction_time
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [
      id_user,
      id_kategori,
      total_harga,
      tipe,
      merchant,
      transaction_date,
      transaction_time,
    ]
  );

  return result.rows[0];
};

const createTransactionItems = async (
  client,
  items,
  id_transaksi
) => {
  const createdItems = [];

  for (const item of items) {
    const subtotal = item.harga * item.qty;

    const result = await client.query(
      `
        INSERT INTO item_transaksi (
          id_transaksi,
          id_kategori,
          nama_item,
          harga,
          qty,
          subtotal
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [
        id_transaksi,
        item.id_kategori,
        item.nama_item,
        item.harga,
        item.qty,
        subtotal,
      ]
    );

    createdItems.push(result.rows[0]);
  }

  return createdItems;
};
const deleteTransactionItems = async (
  client,
  id_transaksi
) => {
  await client.query(
    `
      DELETE FROM item_transaksi
      WHERE id_transaksi = $1
    `,
    [id_transaksi]
  );
};
const deleteTransaction = async (
  client,
  id_transaksi,
  id_user
) => {
  const result = await client.query(
    `
      DELETE FROM transaksi
      WHERE id_transaksi = $1
        AND id_user = $2
      RETURNING *
    `,
    [id_transaksi, id_user]
  );
  return result.rows[0];
};
const getSummary = async (
  userId,
  { month, year }
) => {
  const result = await db.query(
    `
      SELECT
        tipe,
        COALESCE(SUM(total_harga), 0) AS total
      FROM transaksi
      WHERE id_user = $1
        AND EXTRACT(MONTH FROM transaction_date) = $2
        AND EXTRACT(YEAR FROM transaction_date) = $3
      GROUP BY tipe
    `,
    [userId, month, year]
  );
  const countResult = await db.query(
    `
      SELECT COUNT(*) AS total_transaksi
      FROM transaksi
      WHERE id_user = $1
        AND EXTRACT(MONTH FROM transaction_date) = $2
        AND EXTRACT(YEAR FROM transaction_date) = $3
    `,
    [userId, month, year]
  );
  return {
    summary: result.rows,
    total_transaksi:
      Number(
        countResult.rows[0].total_transaksi
      ),
  };
};
const getAnalyticsTransactions =
  async (userId) => {
  const result = await db.query(
    `
    SELECT
      t.id_transaksi AS id,
      t.total_harga AS amount,
      CASE
        WHEN t.tipe = 'pemasukan'
        THEN 'income'
        ELSE 'expense'
      END AS type,
      t.merchant AS description,
      t.transaction_date AS date,
      t.transaction_time AS time,
      -- kategori income
      CASE
        WHEN t.tipe = 'pemasukan'
        THEN json_build_object(
          'id', k.id_kategori,
          'name', k.nama
        )
        ELSE NULL
      END AS category,
      -- items expense
      CASE
        WHEN t.tipe = 'pengeluaran'
        THEN COALESCE(
          json_agg(
            json_build_object(
              'id',
              it.id_item_transaksi,
              'name',
              it.nama_item,
              'qty',
              it.qty,
              'price',
              it.harga,
              'subtotal',
              it.subtotal,
              'category',
              json_build_object(
                'id',
                ik.id_kategori,
                'name',
                ik.nama
              )
            )
          )
          FILTER (
            WHERE it.id_item_transaksi
            IS NOT NULL
          ),
          '[]'
        )
        ELSE NULL
      END AS items
    FROM transaksi t
    LEFT JOIN kategori k
      ON k.id_kategori = t.id_kategori
    LEFT JOIN item_transaksi it
      ON it.id_transaksi = t.id_transaksi
    LEFT JOIN kategori ik
      ON ik.id_kategori = it.id_kategori
    WHERE t.id_user = $1
    GROUP BY
      t.id_transaksi,
      k.id_kategori
    ORDER BY
      t.transaction_date DESC,
      t.transaction_time DESC
    `,
    [userId]
  );

  return result.rows;
};

export default {
  findAll,
  findById,
  createTransaction,
  createTransactionItems,
  deleteTransactionItems,
  deleteTransaction,
  getSummary,
  getAnalyticsTransactions,
};