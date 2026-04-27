export const up = (pgm) => {
  pgm.createTable('transactions', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    category_id: { type: 'uuid', references: 'categories(id)', onDelete: 'SET NULL' },
    amount: { type: 'numeric(15,2)', notNull: true },
    type: { type: 'transaction_type', notNull: true },
    description: { type: 'text' },
    date: { type: 'date', notNull: true },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  // Index biar query by user cepet
  pgm.createIndex('transactions', 'user_id');
  pgm.createIndex('transactions', 'date');
};

export const down = (pgm) => {
  pgm.dropTable('transactions');
};