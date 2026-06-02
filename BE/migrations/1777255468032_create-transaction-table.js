export const up = (pgm) => {
  pgm.createTable("transaksi", {
    id_transaksi: {
      type: "bigserial",
      primaryKey: true,
    },
    id_user: {
      type: "varchar(10)",
      notNull: true,
      references: "users(id_user)",
      onDelete: "CASCADE",
    },
    total_harga: {
      type: "bigint",
      notNull: true,
    },
    tipe: {
      type: "varchar(50)",
      notNull: true,
    },
    merchant: {
      type: "varchar(100)",
      notNull: true,
    },
    transaction_date: {
      type: "date",
    },
    transaction_time: {
      type: "time",
    }});
};

export const down = (pgm) => {
  pgm.dropTable('transactions');
};