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
    pgm.createTable('notification_items', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    notification_id: {
      type: 'uuid',
      notNull: true,
      references: '"notifications"', // Nama tabel referensi harus dibungkus string
      onDelete: 'CASCADE',           // Efek jika data di tabel induk dihapus
    },
    external_anomaly_id: {
      type: 'varchar(100)',
    },
    anomaly_type: {
      type: 'varchar(50)',
      notNull: true,
    },
    message: {
      type: 'text',
      notNull: true,
    },
    is_dismissed: {
      type: 'boolean',
      default: false,
    },
    metadata: {
      type: 'jsonb',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('notification_items');
};
