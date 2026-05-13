import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Trash2, ArrowLeftRight } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from "sonner";

// ── Inline Components ─────────────────────────────────────────

function Card({ children, className = "", ...props }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

function Badge({ children, className = "", variant = "secondary", ...props }) {
  const variants = {
    secondary: "bg-gray-100 text-gray-600",
    success:   "bg-emerald-50 text-emerald-600",
    danger:    "bg-red-50 text-red-600",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variants[variant] ?? variants.secondary} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

function Button({ children, className = "", size = "md", ...props }) {
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm" };
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-xl transition-all active:scale-95 disabled:opacity-50 ${sizes[size] ?? sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ── Data ──────────────────────────────────────────────────────

const DUMMY_TRANSACTIONS = [
  { id: '1', type: 'expense', amount: 85000,   category: 'food',          description: 'Makan Siang Bakso',    date: new Date().toISOString() },
  { id: '2', type: 'income',  amount: 5000000, category: 'salary',        description: 'Gaji Bulanan',         date: new Date().toISOString() },
  { id: '3', type: 'expense', amount: 150000,  category: 'transport',     description: 'Isi Bensin Mobil',     date: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', type: 'expense', amount: 200000,  category: 'entertainment', description: 'Nonton Bioskop',       date: new Date(Date.now() - 86400000).toISOString() },
  { id: '5', type: 'expense', amount: 1200000, category: 'bills',         description: 'Bayar Listrik & Air',  date: new Date(Date.now() - 172800000).toISOString() },
];

const categoryLabels = {
  food: "Makanan", transport: "Transportasi", shopping: "Belanja",
  entertainment: "Hiburan", bills: "Tagihan", health: "Kesehatan",
  education: "Pendidikan", salary: "Gaji", freelance: "Freelance",
  investment: "Investasi", gift: "Hadiah", other: "Lainnya",
};

const categoryIcons = {
  food: "🍕", transport: "🚗", shopping: "🛍️", entertainment: "🎬",
  bills: "📄", health: "💊", education: "📚", salary: "💰",
  freelance: "💻", investment: "📈", gift: "🎁", other: "📦",
};

function formatCurrency(val) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(val);
}

// ── Page ──────────────────────────────────────────────────────

export default function Transactions() {
  const [search,          setSearch]          = useState('');
  const [filterType,      setFilterType]      = useState('all');
  const [filterCategory,  setFilterCategory]  = useState('all');
  const [transactions,    setTransactions]    = useState(DUMMY_TRANSACTIONS);

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
    toast.success('Transaksi berhasil dihapus');
  };

  const filtered = transactions.filter(tx => {
    const matchSearch   = !search || tx.description?.toLowerCase().includes(search.toLowerCase()) || categoryLabels[tx.category]?.toLowerCase().includes(search.toLowerCase());
    const matchType     = filterType     === 'all' || tx.type     === filterType;
    const matchCategory = filterCategory === 'all' || tx.category === filterCategory;
    return matchSearch && matchType && matchCategory;
  });

  const grouped = filtered.reduce((acc, tx) => {
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
          <Button
            size="sm"
            className="text-white border-0 hover:opacity-90 shadow-md"
            style={{ background: "linear-gradient(135deg,#3975E6,#9E4CC6)" }}
          >
            <Plus className="w-4 h-4 mr-1" /> Tambah
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Cari transaksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-11 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all text-sm"
          />
        </div>

        {/* Filter tipe */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-11 px-3 bg-white border border-gray-200 rounded-xl text-sm outline-none cursor-pointer text-gray-700"
        >
          <option value="all">Semua Tipe</option>
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </select>

        {/* Filter kategori */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="h-11 px-3 bg-white border border-gray-200 rounded-xl text-sm outline-none cursor-pointer text-gray-700"
        >
          <option value="all">Semua Kategori</option>
          {Object.entries(categoryLabels).map(([k, v]) => (
            <option key={k} value={k}>{categoryIcons[k]} {v}</option>
          ))}
        </select>
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
                {/* Date label */}
                <p className="text-xs font-bold text-gray-400 mb-3 px-1 uppercase tracking-wider">
                  {dateKey !== 'unknown'
                    ? format(new Date(dateKey), 'EEEE, d MMMM yyyy', { locale: idLocale })
                    : 'Tanggal tidak diketahui'}
                </p>

                {/* Transaction card */}
                <Card className="border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                  <AnimatePresence initial={false}>
                    {txs.map((tx) => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center gap-4 p-4 group hover:bg-gray-50 transition-colors"
                      >
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl shrink-0">
                          {categoryIcons[tx.category] || "📦"}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate text-gray-800">
                            {tx.description || categoryLabels[tx.category]}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge>{categoryLabels[tx.category]}</Badge>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right shrink-0 mr-2">
                          <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-gray-800'}`}>
                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                          </p>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded-xl hover:bg-red-50 text-red-500 transition-all active:scale-90"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
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