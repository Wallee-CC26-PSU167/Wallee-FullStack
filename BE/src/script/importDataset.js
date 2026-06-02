import fs from 'fs';
import csv from 'csv-parser';
import pool from '../config/db.js';

const results = [];

const importDataset = async () => {
  try {
    console.log('Starting dataset import...');

    // =========================
    // READ CSV
    // =========================
    await new Promise((resolve, reject) => {
      fs.createReadStream('./src/dataset/feature_engineered_finance_dataset.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`CSV Loaded: ${results.length} rows`);

    // =========================
    // IMPORT USERS
    // =========================
    const uniqueUsers = new Map();

    for (const row of results) {
    if (!uniqueUsers.has(row.user_id)) {
        uniqueUsers.set(row.user_id, row.persona);
    }
    }

    for (const [userId, persona] of uniqueUsers) {
    await pool.query(
        `
        INSERT INTO users (id_user, nama)
        VALUES ($1, $2)
        ON CONFLICT (id_user)
        DO NOTHING
        `,
        [userId, persona]
    );
    }

    console.log(`Users Imported: ${uniqueUsers.size}`);

    // =========================
    // IMPORT KATEGORI
    // =========================
    const kategoriMap = new Map();

    const uniqueKategori = [
      ...new Set(results.map(row => row.kategori))
    ];

    for (const kategori of uniqueKategori) {

      // DETECT TYPE
      const pemasukanKeywords = [
        'gaji',
        'bonus',
        'pendapatan',
        'income',
      ];

      const lowerKategori = kategori.toLowerCase();

      const type = pemasukanKeywords.some(keyword =>
        lowerKategori.includes(keyword)
      )
        ? 'pemasukan'
        : 'pengeluaran';

      const kategoriResult = await pool.query(
        `
        INSERT INTO kategori (nama, type)
        VALUES ($1, $2)
        ON CONFLICT (nama)
        DO UPDATE SET nama = EXCLUDED.nama
        RETURNING id_kategori
        `,
        [kategori, type]
      );

      kategoriMap.set(
        kategori,
        kategoriResult.rows[0].id_kategori
      );
    }

    console.log(`Kategori Imported: ${uniqueKategori.length}`);

    // =========================
    // IMPORT TRANSAKSI & ITEM
    // =========================
    for (const row of results) {

      // CREATE TRANSACTION
      const transaksiResult = await pool.query(
        `
        INSERT INTO transaksi (
          id_user,
          total_harga,
          tipe,
          merchant,
          transaction_date,
          transaction_time
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id_transaksi
        `,
        [
          row.user_id,
          parseFloat(row.total_harga),
          'pengeluaran',
          row.merchant,
          row.date,
          `${String(row.hour).padStart(2, '0')}:00:00`,
        ]
      );

      const transaksiId =
        transaksiResult.rows[0].id_transaksi;

      // GET CATEGORY ID
      const kategoriId =
        kategoriMap.get(row.kategori);

      // CREATE ITEM TRANSACTION
      await pool.query(
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
        `,
        [
          transaksiId,
          kategoriId,
          row.item,
          parseFloat(row.nominal),
          parseInt(row.qty),
          parseFloat(row.total_harga),
        ]
      );
    }

    console.log('Dataset import completed successfully!');

    process.exit(0);

  } catch (error) {
    console.error('Import Error:', error);
    process.exit(1);
  }
};

importDataset();