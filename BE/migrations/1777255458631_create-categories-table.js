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
  pgm.createType('category_type', [
    'pemasukan',
    'pengeluaran',
  ]);
  pgm.createTable('kategori', {
    id_kategori: {
      type: 'serial',
      primaryKey: true,
    },
    nama: {
      type: 'varchar(100)',
      notNull: true,
      unique: true,
    },
    type: {
      type: 'category_type',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('kategori');
  pgm.dropType('category_type');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
