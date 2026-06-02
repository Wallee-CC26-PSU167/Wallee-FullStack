import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Trash2, ArrowLeftRight, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from "sonner";
import InputFields from '../components/ui/input';
import SelectFields from '../components/ui/select';
import Card from '../components/ui/card';
import Badge from '../components/ui/Badge';
import ButtonGrad from '../components/ui/buttongrad';
import { getTransactions, deleteTransaction } from '../services/transactionService';
import { getCategories } from '../services/category_service';

function formatCurrency(val) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(val);
}

// ── Transaction Item ──────────────────────────────────────────
function TransactionItem({ tx, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const isExpense = tx.type === 'expense';
  const hasItems  = isExpense && Array.isArray(tx.items) && tx.items.length > 0;

  // Kategori: income → tx.category.name | expense → ambil dari items
  const categoryLabel = !isExpense
    ? tx.category?.name ?? '-'
    : null;

  return (
    <motion.div
      key={tx.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="group"
    >
      {/* Row utama */}
      <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">

        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl shrink-0">
          {isExpense ? '🛍️' : '💰'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate text-gray-800">
            {tx.description}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {/* Badge kategori — income */}
            {!isExpense && categoryLabel && (
              <Badge>{categoryLabel}</Badge>
            )}

            {/* Badge jumlah item — expense */}
            {hasItems && (
              <Badge className="bg-blue-50 text-blue-600 border-0">
                {tx.items.length} item
              </Badge>
            )}

            {/* Tombol expand items */}
            {hasItems && (
              <button
                onClick={() => setExpanded(p => !p)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-blue-500 transition-colors"
              >
                {expanded ? 'Sembunyikan' : 'Lihat item'}
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Nominal */}
        <div className="text-right shrink-0 mr-2">
          <p className={`text-sm font-bold ${isExpense ? 'text-gray-800' : 'text-emerald-600'}`}>
            {isExpense ? '-' : '+'}{formatCurrency(tx.amount)}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {tx.time?.slice(0, 5)}
          </p>
        </div>

        {/* Delete */}
        <button
          onClick={() => onDelete(tx.id)}
          className="opacity-0 group-hover:opacity-100 p-2 rounded-xl hover:bg-red-50 text-red-400 transition-all active:scale-90 flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Items expandable — hanya untuk expense */}
      <AnimatePresence initial={false}>
        {expanded && hasItems && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mx-4 mb-3 bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100">

              {/* Header kolom */}
              <div className="grid grid-cols-12 gap-2 px-3 py-2">
                <span className="col-span-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Item</span>
                <span className="col-span-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kategori</span>
                <span className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Qty</span>
                <span className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Subtotal</span>
              </div>

              {/* Baris per item */}
              {tx.items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 px-3 py-2.5 items-center">
                  <div className="col-span-5 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-gray-400">{formatCurrency(item.price)}/pcs</p>
                  </div>
                  <div className="col-span-3 min-w-0">
                    {item.category?.name
                      ? <Badge className="text-[10px] truncate max-w-full">{item.category.name}</Badge>
                      : <span className="text-[10px] text-gray-300">-</span>
                    }
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-xs font-semibold text-gray-600">{item.qty}x</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-xs font-bold text-gray-800">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Total baris */}
              <div className="flex justify-between items-center px-3 py-2.5">
                <span className="text-xs font-semibold text-gray-500">Total</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(tx.amount)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function Transactions() {
  const [search,         setSearch]         = useState('');
  const [filterType,     setFilterType]     = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [transactions,   setTransactions]   = useState([]);
  const [categories,     setCategories]     = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.data);
      } catch (e) { console.log(e); }
    };
    loadCategories();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTimeout(() => setTransactions(data.data), 0);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      fetchTransactions();
      toast.success('Transaksi berhasil dihapus');
    } catch (e) {
      toast.error('Gagal menghapus transaksi');
    }
  };

  // Filter — kategori expense cek di items, income cek di tx.category
  const filtered = transactions.filter(tx => {
    const matchSearch = !search ||
      tx.description?.toLowerCase().includes(search.toLowerCase()) ||
      tx.items?.some(i => i.name?.toLowerCase().includes(search.toLowerCase()));

    const matchType = filterType === 'all' || tx.type === filterType;

    const matchCategory = filterCategory === 'all' || (
      tx.type === 'income'
        ? tx.category?.name === filterCategory
        : tx.items?.some(i => i.category?.name === filterCategory)
    );

    return matchSearch && matchType && matchCategory;
  });

  const grouped = filtered.slice(0, 30).reduce((acc, tx) => {
    const key = tx.date ? tx.date.split('T')[0] : 'unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(tx);
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-5 min-h-screen">

      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transaksi</h1>
          <p className="text-sm text-gray-400">Lihat riwayat keuangan Anda</p>
        </div>
        <Link to="/add-transaction">
          <ButtonGrad size="sm" className="px-4 h-9 hover:opacity-90">
            <Plus className="w-4 h-4 mr-1" /> Tambah
          </ButtonGrad>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <InputFields
            placeholder="Cari transaksi atau nama item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <SelectFields
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="sm:w-40"
        >
          <option value="all">Semua Tipe</option>
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </SelectFields>

        <SelectFields
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="sm:w-48"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </SelectFields>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <ArrowLeftRight className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">Belum ada transaksi</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto mt-1">
              Mulai catat pengeluaran dan pemasukan Anda untuk mendapatkan insight keuangan.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped)
            .sort(([a], [b]) => new Date(b) - new Date(a))
            .map(([dateKey, txs]) => (
              <div key={dateKey}>
                <p className="text-xs font-bold text-gray-400 mb-3 px-1 uppercase tracking-wider">
                  {dateKey !== 'unknown'
                    ? format(new Date(dateKey), 'EEEE, d MMMM yyyy', { locale: idLocale })
                    : 'Tanggal tidak diketahui'}
                </p>

                {/* overflow-visible agar popover/expand tidak terpotong */}
                <Card className="border border-gray-100 divide-y divide-gray-100 overflow-visible">
                  <AnimatePresence initial={false}>
                    {txs.map((tx) => (
                      <TransactionItem
                        key={tx.id}
                        tx={tx}
                        onDelete={handleDelete}
                      />
                    ))}
                  </AnimatePresence>
                </Card>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}