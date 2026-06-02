export const up = (pgm) => {
  pgm.addColumn('transaksi', {
    id_kategori: {
      type: 'integer',
      references: 'kategori(id_kategori)',
      onDelete: 'SET NULL',
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumn(
    'transaksi',
    'id_kategori'
  );
};