import db from "../config/db.js";
import redis from "../config/redis.js";
import axios from "axios";

const generateDailyAnomaly = async (
  userId
) => {
  const transactionResult =
    await db.query(
      `
      SELECT
          t.id_transaksi,
          t.merchant,
          t.total_harga AS amount,
          t.transaction_date AS date,
          t.transaction_time AS time,
          dt.nama_item AS item_name,
          dt.harga,
          dt.qty,
          dt.subtotal,
          k.nama AS category
      FROM transaksi t
      JOIN item_transaksi dt
          ON dt.id_transaksi = t.id_transaksi
      LEFT JOIN kategori k
          ON k.id_kategori = dt.id_kategori
      WHERE t.id_user = $1
      AND t.transaction_date = CURRENT_DATE - 1
      ORDER BY t.transaction_date DESC
      `,
      [userId]
    );
  const transactions =
    transactionResult.rows;
  if (transactions.length === 0) {
    return [];
  }
  const groupedTransactions = {};
  for (const row of transactions) {
    const frequencyResult = await db.query(
    `
    SELECT
        (
        SELECT COUNT(*)
        FROM transaksi
        WHERE id_user = $1
            AND merchant = $2
            AND EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE)
            AND EXTRACT(MONTH FROM transaction_date) = EXTRACT(MONTH FROM CURRENT_DATE)
        ) AS merchant_monthly_freq,
        (
        SELECT AVG(monthly_count)
        FROM (
            SELECT COUNT(*) AS monthly_count
            FROM transaksi
            WHERE id_user = $1
            AND merchant = $2
            AND (
                EXTRACT(YEAR FROM transaction_date) < EXTRACT(YEAR FROM CURRENT_DATE)
                OR (
                EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM transaction_date) < EXTRACT(MONTH FROM CURRENT_DATE)
                )
            )
            GROUP BY
            EXTRACT(YEAR FROM transaction_date),
            EXTRACT(MONTH FROM transaction_date)
        ) m
        ) AS merchant_avg_freq
    `,
    [userId, row.merchant]
    );
    const merchantFrequency = frequencyResult.rows[0];
    if (
      !groupedTransactions[
        row.id_transaksi
      ]
    ) {
      groupedTransactions[
        row.id_transaksi
      ] = {
        id: row.id_transaksi,
        merchant: row.merchant,
        amount: Number(row.amount),
        date:
          row.date
            ?.toISOString()
            ?.split("T")[0],
        time: row.time,
        item_count: 0,
        merchant_monthly_freq: Number(merchantFrequency.merchant_monthly_freq)||0,
        merchant_avg_freq: Number(merchantFrequency.merchant_avg_freq)||0,
        items: []
      };
    }
    groupedTransactions[
      row.id_transaksi
    ]
      .items
      .push({
        item_name: row.item_name,
        harga: Number(row.harga),
        qty: row.qty,
        subtotal: Number(row.subtotal),
        category: row.category,
        usual_price: 0
      });
    groupedTransactions[
      row.id_transaksi
    ]
      .item_count =
        groupedTransactions[
          row.id_transaksi
        ]
          .items
          .length;
  }
  const formattedTransactions =
    Object.values(
      groupedTransactions
    );
  console.log(" formatted transaksi : ", JSON.stringify(formattedTransactions, null, 2));
  console.log(
    "FORMATTED TRANSACTIONS:",
    formattedTransactions
  );
  console.log("CALLING AI API...");
  const aiResponse = await axios.post(
    process.env.AI_ANOMALY_URL,
    formattedTransactions,
    {
      headers: {
        "Content-Type":
          "application/json"
      }
    }
  );
  console.log(
    "AI RESPONSE:",
    aiResponse.data
  );
  const aiResults =
    aiResponse.data;
  for (const aiResult of aiResults) {
    await saveNotification(
      aiResult,
      userId
    );
  }
  return aiResults;
};
async function handleDailyAiGeneration(userId) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const targetDate = yesterday.toISOString().split("T")[0];
    const generateKey = `anomaly-generated:${userId}:${targetDate}`;
    const alreadyGenerated = await redis.get(generateKey);
    if (!alreadyGenerated) {
        console.log(`GENERATING DAILY ANOMALY FOR USER ${userId}...`);
        await generateDailyAnomaly(userId);
        await redis.set(generateKey, "true", "EX", 86400);
    } else {
        console.log(`AI ALREADY GENERATED TODAY FOR USER ${userId}`);
    }
}
const getNotifications = async (userId) => {
    await handleDailyAiGeneration(userId);
    const today = new Date().toISOString().split("T")[0];
    const cacheKey = `notifications:${userId}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }
  const result = await db.query(
    `
    SELECT
      n.id AS notification_id,
      n.transaction_id,
      n.merchant,
      n.amount,
      n.transaction_date,
      n.transaction_time,
      n.item_count,
      n.created_at,

      ni.id AS item_id,
      ni.external_anomaly_id,
      ni.anomaly_type,
      ni.message,
      ni.is_dismissed,
      ni.metadata

    FROM notifications n
    JOIN notification_items ni
      ON ni.notification_id = n.id
    JOIN transaksi t
      ON t.id_transaksi = n.transaction_id::bigint
    WHERE t.id_user = $1

    ORDER BY n.created_at DESC
    `,
    [userId]
  );
  await redis.set(
    cacheKey,
    JSON.stringify(result.rows),
    "EX",
    60 * 60 * 24
  );
  const groupedNotifications = {};
    for (const row of result.rows) {
    if (!groupedNotifications[row.notification_id]) {
        groupedNotifications[row.notification_id] = {
            id: row.transaction_id,
            merchant: row.merchant,
            amount: Number(row.amount),
            date: row.transaction_date
                ? row.transaction_date.toLocaleDateString('en-CA')
                : null,
            time: row.transaction_time,
            item_count: row.item_count,
            anomalies: []
            };
    }
     groupedNotifications[row.notification_id]
        .anomalies
        .push({
            id: row.item_id,
            external_id: row.external_anomaly_id,
            type: row.anomaly_type,
            message: row.message,
            detail: row.metadata,
            dismissed: row.is_dismissed
        });
    }
    const formattedNotifications =
    Object.values(groupedNotifications);
    await redis.set(
        cacheKey,
        JSON.stringify(formattedNotifications),
        "EX",
        60 * 60 * 24
        );
    return formattedNotifications;
};

const saveNotification = async (aiResult, userId) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const notificationResult = await client.query(
      `
      INSERT INTO notifications (
        transaction_id,
        merchant,
        amount,
        transaction_date,
        transaction_time,
        item_count
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        aiResult.id,
        aiResult.merchant,
        aiResult.amount,
        aiResult.date,
        aiResult.time,
        aiResult.item_count
      ]
    );

    const notification = notificationResult.rows[0];
    for (const anomaly of aiResult.anomalies) {
      await client.query(
        `
        INSERT INTO notification_items (
          notification_id,
          external_anomaly_id,
          anomaly_type,
          message,
          is_dismissed,
          metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          notification.id,
          anomaly.id,
          anomaly.type,
          anomaly.message,
          anomaly.dismissed || false,
          JSON.stringify(anomaly.detail)
        ]
      );
    }
    await client.query("COMMIT");

    await redis.del(`notifications:${userId}`);
    return notification;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const dismissNotification = async (
  itemId,
  userId
) => {
  await db.query(
    `
    UPDATE notification_items
    SET is_dismissed = true
    WHERE id = $1
    `,
    [itemId]
  );
  await redis.del(`notifications:${userId}`);
  return true;
};
const getLatestUnreadNotification =
  async (userId) => {
  const result = await db.query(
    `
    SELECT
      n.id AS notification_id,
      n.transaction_id,
      n.merchant,
      n.amount,
      n.transaction_date,
      n.transaction_time,
      n.item_count,
      n.created_at,

      ni.id AS item_id,
      ni.external_anomaly_id,
      ni.anomaly_type,
      ni.message,
      ni.is_dismissed,
      ni.metadata

    FROM notifications n
    JOIN notification_items ni
      ON ni.notification_id = n.id
    JOIN transaksi t
      ON t.id_transaksi = n.transaction_id::bigint
    WHERE t.id_user = $1
      AND ni.is_dismissed = false
    ORDER BY n.created_at DESC
    `,
    [userId]
  );
  if (result.rows.length === 0) {
    return null;
  }
  const groupedNotifications = {};
  for (const row of result.rows) {
    if (
      !groupedNotifications[
        row.notification_id
      ]
    ) {
      groupedNotifications[
        row.notification_id
      ] = {
        id: row.transaction_id,
        merchant: row.merchant,
        amount: Number(row.amount),
        date: row.transaction_date
          ? row.transaction_date.toLocaleDateString('en-CA')
          : null,
        time: row.transaction_time,
        item_count: row.item_count,
        anomalies: []
      };
    }

    groupedNotifications[
      row.notification_id
    ]
    .anomalies
    .push({
      id: row.item_id,
      type: row.anomaly_type,
      message: row.message,
      detail: row.metadata,
      dismissed: row.is_dismissed
    });
  }

  return Object.values(
    groupedNotifications
  )[0];
};

export default {
  getNotifications,
  saveNotification,
  dismissNotification,
  getLatestUnreadNotification,
  generateDailyAnomaly,
};