import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Trash2, ArrowLeftRight, ChevronDown, AlertTriangle, X } from 'lucide-react';
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
import { getNotifications, dismissNotification } from '../services/anomalyService';
import { getCategories } from '../services/category_service';

// ── Helpers ───────────────────────────────────────────────────
function formatCurrency(val) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(val);
}

const ANOMALY_TYPE_LABEL = {
  PRICE_SPIKE:      "Lonjakan Harga",
  UNUSUAL_TIME:     "Waktu Tidak Biasa",
  UNUSUAL_LOCATION: "Lokasi Tidak Biasa",
  DUPLICATE:        "Transaksi Duplikat",
};

const ANOMALY_TYPE_COLOR = {
  PRICE_SPIKE:      { bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)",  text: "#DC2626" },
  UNUSUAL_TIME:     { bg: "rgba(234,179,8,0.08)",  border: "rgba(234,179,8,0.2)",  text: "#CA8A04" },
  UNUSUAL_LOCATION: { bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)", text: "#EA580C" },
  DUPLICATE:        { bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)", text: "#9333EA" },
};

// ── Anomaly Popover ───────────────────────────────────────────
function AnomalyPopover({ notification, onClose, onDismissed }) {
  const ref         = useRef(null);
  const [items, setItems] = useState(notification.items);
  const [loadingId, setLoadingId] = useState(null);

  // Tutup jika klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleDismiss = async (itemId) => {
    setLoadingId(itemId);
    try {
      await dismissNotification(itemId);

      // Update state lokal — tandai item sebagai sudah dibaca
      setItems(prev =>
        prev.map(i => i.id === itemId ? { ...i, is_dismissed: true } : i)
      );

      toast.success("Anomali ditandai sudah dibaca");
      onDismissed(); // trigger refetch di parent
    } catch {
      toast.error("Gagal memperbarui status anomali");
    } finally {
      setLoadingId(null);
    }
  };

  const activeItems    = items.filter(i => !i.is_dismissed);
  const dismissedItems = items.filter(i => i.is_dismissed);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      exit={{    opacity: 0, scale: 0.95, y: -4  }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-8 w-72 bg-white rounded-2xl border border-gray-100 overflow-hidden"
      style={{ zIndex: 50, boxShadow: "0 8px 32px rgba(15,24,41,0.14)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <p className="text-sm font-bold text-gray-800">Detail Anomali</p>
          <p className="text-[10px] text-gray-400">{items.length} anomali ditemukan</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Active items */}
      {activeItems.length > 0 && (
        <div className="p-3 space-y-2">
          {activeItems.map((item) => {
            const color = ANOMALY_TYPE_COLOR[item.anomaly_type]
              ?? { bg: "rgba(107,114,128,0.08)", border: "rgba(107,114,128,0.2)", text: "#6B7280" };

            return (
              <div
                key={item.id}
                className="rounded-xl p-3"
                style={{ background: color.bg, border: `1px solid ${color.border}` }}
              >
                {/* Type label */}
                <span
                  className="text-[10px] font-bold uppercase tracking-wider block mb-1"
                  style={{ color: color.text }}
                >
                  {ANOMALY_TYPE_LABEL[item.anomaly_type] ?? item.anomaly_type}
                </span>

                {/* Pesan */}
                <p className="text-xs text-gray-700 leading-relaxed mb-2">
                  {item.message}
                </p>

                {/* Metadata */}
                {item.metadata && (
                  <div className="bg-white/70 rounded-lg px-2.5 py-2 mb-2 space-y-0.5">
                    {Object.entries(item.metadata).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[11px]">
                        <span className="text-gray-400 capitalize">
                          {k.replace(/_/g, ' ')}
                        </span>
                        <span className="font-semibold text-gray-700">
                          {typeof v === 'number' && k.includes('price')
                            ? formatCurrency(v)
                            : String(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tombol dismiss */}
                <button
                  onClick={() => handleDismiss(item.id)}
                  disabled={loadingId === item.id}
                  className="w-full h-7 rounded-lg text-[11px] font-semibold text-white transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-1.5"
                  style={{ background: "linear-gradient(135deg,#3975E6,#9E4CC6)" }}
                >
                  {loadingId === item.id ? (
                    <>
                      <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      Memproses...
                    </>
                  ) : "Tandai sudah dibaca"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Dismissed items */}
      {dismissedItems.length > 0 && (
        <div className="px-3 pb-3 space-y-1.5">
          {activeItems.length > 0 && (
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-1 pb-1">
              Sudah dibaca
            </p>
          )}
          {dismissedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl"
            >
              <span className="text-gray-300 text-sm">✓</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-gray-400">
                  {ANOMALY_TYPE_LABEL[item.anomaly_type] ?? item.anomaly_type}
                </p>
                <p className="text-[11px] text-gray-400 truncate">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── Transaction Item ──────────────────────────────────────────
function TransactionItem({ tx, notification, onDelete, onAnomalyDismissed }) {
  const [expanded,     setExpanded]     = useState(false);
  const [showAnomaly,  setShowAnomaly]  = useState(false);

  const isExpense      = tx.type === 'expense';
  const hasItems       = isExpense && Array.isArray(tx.items) && tx.items.length > 0;
  const categoryLabel  = !isExpense ? tx.category?.name ?? '-' : null;

  // Badge anomali — aktif jika ada item yang belum dismissed
  const hasAnomaly      = !!notification;
  const hasActiveAnomaly = notification?.items?.some(i => !i.is_dismissed);

  return (
    <motion.div
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

            {/* Expand items */}
            {hasItems && (
              <button
                onClick={() => setExpanded(p => !p)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-blue-500 transition-colors"
              >
                {expanded ? 'Sembunyikan' : 'Lihat item'}
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
              </button>
            )}

            {/* Badge anomali */}
            {hasAnomaly && (
              <div className="relative">
                <button
                  onClick={() => setShowAnomaly(p => !p)}
                  className={[
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all active:scale-95",
                    hasActiveAnomaly
                      ? "bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100"
                      : "bg-gray-100 text-gray-400 border border-gray-200 hover:bg-gray-200",
                  ].join(" ")}
                >
                  <AlertTriangle className="w-3 h-3" />
                  {hasActiveAnomaly ? "Anomali" : "Diperiksa"}
                </button>

                <AnimatePresence>
                  {showAnomaly && (
                    <AnomalyPopover
                      notification={notification}
                      onClose={() => setShowAnomaly(false)}
                      onDismissed={() => {
                        setShowAnomaly(false);
                        onAnomalyDismissed();
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Nominal + waktu */}
        <div className="text-right shrink-0 mr-2">
          <p className={`text-sm font-bold ${isExpense ? 'text-gray-800' : 'text-emerald-600'}`}>
            {isExpense ? '-' : '+'}{formatCurrency(tx.amount)}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">{tx.time?.slice(0, 5)}</p>
        </div>

        {/* Delete */}
        <button
          onClick={() => onDelete(tx.id)}
          className="opacity-0 group-hover:opacity-100 p-2 rounded-xl hover:bg-red-50 text-red-400 transition-all active:scale-90 flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Expandable items */}
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
              <div className="grid grid-cols-12 gap-2 px-3 py-2">
                <span className="col-span-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Item</span>
                <span className="col-span-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kategori</span>
                <span className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Qty</span>
                <span className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Subtotal</span>
              </div>
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
                    <span className="text-xs font-bold text-gray-800">{formatCurrency(item.subtotal)}</span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center px-3 py-2.5">
                <span className="text-xs font-semibold text-gray-500">Total</span>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(tx.amount)}</span>
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

  // Map transaction_id → notification untuk lookup O(1)
  const [anomalyMap, setAnomalyMap] = useState({});

  // ── Fetch categories ────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCategories();
        setCategories(data.data);
      } catch (e) { console.log(e); }
    };
    load();
  }, []);

  // ── Fetch transactions ──────────────────────────────────────
  const fetchTransactions = useCallback(async () => {
    try {
      const data = await getTransactions();
      setTimeout(() => setTransactions(data.data), 0);
    } catch (e) { console.log(e); }
  }, []);

  // ── Fetch anomalies ─────────────────────────────────────────
  const fetchAnomalies = useCallback(async () => {
    try {
      const data = await getNotifications();
      // Bangun map: transaction_id → notification object
      const map = {};
      const list = data.data ?? data; // handle { data: [...] } atau [...]
      list.forEach(notif => {
        map[notif.transaction_id] = notif;
      });
      setAnomalyMap(map);
    } catch (e) { console.log(e); }
  }, []);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAnomalies();
  }, [fetchTransactions, fetchAnomalies]);

  // ── Delete ──────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      fetchTransactions();
      toast.success('Transaksi berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus transaksi');
    }
  };

  // ── Filter ──────────────────────────────────────────────────
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
                <Card className="border border-gray-100 divide-y divide-gray-100 overflow-visible">
                  <AnimatePresence initial={false}>
                    {txs.map((tx) => (
                      <TransactionItem
                        key={tx.id}
                        tx={tx}
                        notification={anomalyMap[tx.id] ?? null}
                        onDelete={handleDelete}
                        onAnomalyDismissed={fetchAnomalies}
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