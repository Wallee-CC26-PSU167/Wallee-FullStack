import db from "../config/db.js";
const getCategoryIcon = (name) => {
  const icons = {
    "Gaji": "💰",
    "Freelance": "💻",
    "Bisnis": "🏢",
    "Hadiah": "🎁",
    "Investasi": "📈",

    "Belanja": "🛍️",
    "Hiburan": "🎮",
    "Kesehatan": "💊",
    "Makanan & Minuman": "🍔",
    "Olahraga": "🏋️",
    "Pakaian": "👕",
    "Pendidikan": "📚",
    "Perawatan Diri": "💆",
    "Rumah Tangga": "🏠",
    "Sosial": "🎉",
    "Tagihan & Utilitas": "🧾",
    "Transportasi": "🚗",

    "Lainnya": "📦",
  };

  return icons[name] || "📦";
};
const findAll = async ({ type }) => {
  const params = [];
  let where = "";

  if (type) {
    where = `WHERE type = $1`;
    params.push(
      type === "income"
        ? "pemasukan"
        : "pengeluaran"
    );
  }

  const result = await db.query(
    `
      SELECT
        id_kategori AS id,
        nama AS name,
        CASE
          WHEN type = 'pemasukan'
          THEN 'income'
          ELSE 'expense'
        END AS type
      FROM kategori
      ${where}
      ORDER BY type, nama ASC
    `,
    params
  );
  return result.rows.map((item) => ({
    ...item,
    icon: getCategoryIcon(item.name),
  }));
};

export default {
  findAll,
};