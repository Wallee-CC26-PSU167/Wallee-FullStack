/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("item_transaksi", {
    id_item_transaksi: {
      type: "bigserial",
      primaryKey: true,
    },
    id_transaksi: {
      type: "bigint",
      notNull: true,
      references: "transaksi(id_transaksi)",
      onDelete: "CASCADE",
    },
    id_kategori: {
      type: "integer",
      notNull: true,
      references: "kategori(id_kategori)",
      onDelete: "CASCADE",
    },
    nama_item: {
      type: "varchar(150)",
      notNull: true,
    },
    harga: {
      type: "bigint",
      notNull: true,
    },
    qty: {
      type: "integer",
      notNull: true,
    },
    subtotal: {
      type: "bigint",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
