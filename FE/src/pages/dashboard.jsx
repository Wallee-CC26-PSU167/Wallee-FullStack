import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, TrendingUp, TrendingDown, ArrowLeftRight, 
  Plus, BarChart3, MessageSquare, ChevronRight, 
  Eye, EyeOff, Sparkles, X, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import Card from '../components/ui/card';
import ButtonGrad from '../components/ui/buttongrad';
import Badge from '../components/ui/Badge';
import { getTransactions } from '../services/transactionService';

// ── Dummy notifikasi AI ───────────────────────────────────────
// Dummy — ganti dengan fetch API saat backend siap
// GET /anomalies/latest?dismissed=false
const DUMMY_ANOMALY = {
  id: "trx_001",
  merchant: "Superindo Babarsari",
  amount: 187500,
  date: "2025-04-28",
  time: "02:14",
  anomalies: [
    {
      id: "an_001",
      type: "PRICE_SPIKE",
      message: "Harga item naik 3× dari biasanya",
      detail: [
        { item_name: "Susu Ultra 1L", usual_price: 12000, current_price: 36000 }
      ],
      dismissed: false,
    },
    {
      id: "an_002",
      type: "UNUSUAL_TIME",
      message: "Transaksi di luar jam biasa",
      detail: [
        { usual_hour: "08:00", detected_hour: "02:14" }
      ],
      dismissed: false,
    },
  ],
};

const ANOMALY_TYPE_LABEL = {
  PRICE_SPIKE:   "Lonjakan Harga",
  UNUSUAL_TIME:  "Waktu Tidak Biasa",
  UNUSUAL_LOCATION: "Lokasi Tidak Biasa",
  DUPLICATE:     "Transaksi Duplikat",
};
// Ganti dengan API call ke backend saat sudah siap
// Urutkan dari yang terbaru (index 0 = paling baru)
// ── AI Notification Banner ────────────────────────────────────
// Tidak ada lagi prop onDismiss

// Dummy 3 transaksi anomali terbaru — ganti dengan API
// GET /anomalies/recent?limit=3
const DUMMY_BELL_NOTIFICATIONS = [
  {
    id: "trx_001",
    merchant: "Superindo Babarsari",
    amount: 187500,
    date: "2025-04-28",
    time: "02:14",
    anomalies: [
      { id: "an_001", type: "PRICE_SPIKE",  message: "Harga item naik 3× dari biasanya", dismissed: false },
      { id: "an_002", type: "UNUSUAL_TIME", message: "Transaksi di luar jam biasa",       dismissed: false },
    ],
  },
  {
    id: "trx_002",
    merchant: "Gojek Food",
    amount: 65000,
    date: "2025-04-27",
    time: "13:20",
    anomalies: [
      { id: "an_003", type: "UNUSUAL_TIME", message: "Transaksi di luar jam biasa", dismissed: true },
    ],
  },
  {
    id: "trx_003",
    merchant: "Indomaret Seturan",
    amount: 43000,
    date: "2025-04-26",
    time: "23:45",
    anomalies: [
      { id: "an_004", type: "PRICE_SPIKE", message: "Lonjakan harga tidak wajar", dismissed: false },
    ],
  },
];

function BellDropdown({ onClose }) {
  const [notifications, setNotifications] = useState(DUMMY_BELL_NOTIFICATIONS);

  // Fetch ulang saat dropdown dibuka
  useEffect(() => {
    // Ganti dengan: 
    // const res = await api.get("/anomalies/recent?limit=3")
    // setNotifications(res.data)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotifications(DUMMY_BELL_NOTIFICATIONS);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-[0_8px_32px_rgba(15,24,41,0.14)] border border-gray-100 overflow-hidden z-50"
    >
      {/* Header dropdown */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-800">Notifikasi Anomali</span>
          {/* Badge jumlah unread */}
          {notifications.some(n => n.anomalies.some(a => !a.dismissed)) && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white"
              style={{ background: "linear-gradient(135deg,#3975E6,#9E4CC6)" }}
            >
              {notifications.filter(n => n.anomalies.some(a => !a.dismissed)).length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* List notifikasi */}
      <div className="divide-y divide-gray-100">
        {notifications.map((trx) => {
          const hasUnread  = trx.anomalies.some(a => !a.dismissed);
          const totalCount = trx.anomalies.length;
          const preview    = trx.anomalies[0]?.message ?? "";

          return (
            <div
              key={trx.id}
              className="flex items-start gap-3 px-4 py-3 transition-colors"
              style={{
                background: hasUnread
                  ? "linear-gradient(135deg, rgba(57,117,230,0.06), rgba(158,76,198,0.06))"
                  : "#ffffff",
              }}
            >
              {/* Dot indikator */}
              <div className="mt-1.5 flex-shrink-0">
                {hasUnread
                  ? <span className="w-2 h-2 rounded-full block bg-blue-500" />
                  : <span className="w-2 h-2 rounded-full block bg-gray-200" />
                }
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Merchant + badge jumlah anomali */}
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {trx.merchant}
                  </p>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={hasUnread
                      ? { background: "rgba(57,117,230,0.12)", color: "#3975E6" }
                      : { background: "#F3F4F6", color: "#9CA3AF" }
                    }
                  >
                    {totalCount} anomali
                  </span>
                </div>

                {/* Amount + tanggal */}
                <p className="text-[11px] text-gray-400 mb-1">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency', currency: 'IDR', maximumFractionDigits: 0
                  }).format(trx.amount)}
                  {" · "}
                  {trx.date} {trx.time}
                </p>

                {/* Preview pesan anomali pertama */}
                <p
                  className="text-xs leading-relaxed truncate"
                  style={{ color: hasUnread ? "#374151" : "#9CA3AF" }}
                >
                  ⚠️ {preview}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer — link ke transaksi */}
      <Link
        to="/transaksi"
        onClick={onClose}
        className="flex items-center justify-center gap-1 px-4 py-3 text-xs font-semibold border-t border-gray-100 hover:bg-gray-50 transition-colors"
        style={{ color: "#3975E6" }}
      >
        Lihat semua di Transaksi
        <ChevronRight className="w-3 h-3" />
      </Link>
    </motion.div>
  );
}
function AINotificationBanner({ transaction }) {
  if (!transaction) return null;

  // Hanya tampilkan anomali yang belum dismissed
  const activeAnomalies = transaction.anomalies.filter(a => !a.dismissed);
  if (activeAnomalies.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl p-4 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(57,117,230,0.08), rgba(158,76,198,0.08))",
          border: "1px solid rgba(57,117,230,0.2)",
        }}
      >
        {/* Glow accent kiri */}
        <div
          className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
          style={{ background: "linear-gradient(180deg,#3975E6,#9E4CC6)" }}
        />

        <div className="flex items-start gap-3 pl-2">
          {/* Icon */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: "linear-gradient(135deg,#3975E6,#9E4CC6)" }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* Label + badge jumlah anomali */}
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "#3975E6" }}
              >
                Anomali Terdeteksi
              </span>
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white"
                style={{ background: "linear-gradient(135deg,#3975E6,#9E4CC6)" }}
              >
                {activeAnomalies.length}
              </span>
            </div>

            {/* Info transaksi */}
            <p className="text-sm font-semibold text-gray-800 mb-0.5">
              {transaction.merchant}
            </p>
            <p className="text-xs text-gray-400 mb-3">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(transaction.amount)}
              {" · "}
              {transaction.date} {transaction.time}
            </p>

            {/* List anomali */}
            <div className="flex flex-col gap-2">
              {activeAnomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="flex items-start gap-2 bg-white/60 rounded-xl px-3 py-2 border border-white/80"
                >
                  <span className="text-base mt-0.5">⚠️</span>
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: "#9E4CC6" }}
                    >
                      {ANOMALY_TYPE_LABEL[anomaly.type] ?? anomaly.type}
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {anomaly.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA ke halaman transaksi */}
            <Link
              to="/transaksi"
              className="inline-flex items-center gap-1 mt-3 text-xs font-semibold"
              style={{ color: "#3975E6" }}
            >
              Lihat detail di Transaksi
              <ChevronRight className="w-3 h-3" />
            </Link>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Dashboard ─────────────────────────────────────────────────
export default function Dashboard() {
  const [transactions,   setTransactions]   = useState([]);
  const [balanceHidden,  setBalanceHidden]  = useState(false);
  const [notification,   setNotification]   = useState(null);
  const [anomaly, setAnomaly] = useState(null);
  const [bellOpen, setBellOpen] = useState(false);
  const hasUnreadAnomaly = DUMMY_BELL_NOTIFICATIONS.some(
  n => n.anomalies.some(a => !a.dismissed)
);

  // Ambil notifikasi terbaru saat mount
  useEffect(() => {
  // Ganti dengan: const res = await api.get("/anomalies/latest?dismissed=false")
  // setAnomaly(res.data)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setAnomaly(DUMMY_ANOMALY);
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTimeout(() => {
        setTransactions(data.data.transactions);
      }, 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalIncome  = transactions.filter(t => t?.type === 'income').reduce((s, t) => s + parseFloat(t.amount), 0);
  const totalExpense = transactions.filter(t => t?.type === 'expense').reduce((s, t) => s + parseFloat(t.amount), 0);
  const balance      = totalIncome - totalExpense;

  const formatCurrency = (val) => {
    if (balanceHidden) return "••••••••";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const formatUang = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6 bg-background min-h-screen">

      {/* 1. HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between relative overflow-visible"
        style={{ position: "relative", zIndex: 50 }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[hsl(225,20%,12%)]">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Ringkasan keuangan Anda hari ini</p>
        </div>

        {/* Bell icon — badge merah jika ada notif belum dibaca */}
        {/* Bell section — ganti div relative yang sudah ada */}
        <div className="relative">
          <button
            onClick={() => setBellOpen(prev => !prev)}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Bell className="w-5 h-5" />
          </button>

          {/* Badge merah */}
          {hasUnreadAnomaly && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white pointer-events-none" />
          )}

          {/* Dropdown */}
          <AnimatePresence>
            {bellOpen && (
              <BellDropdown onClose={() => setBellOpen(false)} />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 2. BALANCE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[linear-gradient(135deg,#3975E6,#9E4CC6)] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20"
      >
        <Card className="absolute inset-0 bg-[linear-gradient(135deg,#3975E6,#9E4CC6)]" />

        {/* Decorative circles — sama seperti forecast card analitik */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-6 left-1/3 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-12 h-12 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/80 text-sm font-medium">Total Saldo</p>
            <button onClick={() => setBalanceHidden(!balanceHidden)} className="text-white/60 hover:text-white transition-colors p-1">
              {balanceHidden ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
            {formatCurrency(balance)}
          </p>
          <div className="flex gap-8">
            <div>
              <p className="text-white/70 text-xs mb-1 uppercase tracking-wider font-semibold">Pemasukan</p>
              <p className="text-lg font-bold">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="w-px h-10 bg-white/20 self-end mb-1" />
            <div>
              <p className="text-white/70 text-xs mb-1 uppercase tracking-wider font-semibold">Pengeluaran</p>
              <p className="text-lg font-bold">{formatCurrency(totalExpense)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. AI NOTIFICATION BANNER */}
      <AINotificationBanner transaction={anomaly} />

      {/* 4. QUICK ACTIONS */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Plus,           label: "Tambah",  path: "/add-transaction", grad: true },
          { icon: ArrowLeftRight, label: "Riwayat", path: "/transactions" },
          { icon: BarChart3,      label: "Analitik",path: "/analytics" },
          { icon: MessageSquare,  label: "AI Chat", path: "/chat" },
        ].map((action, i) => (
          <Link key={i} to={action.path} className="flex flex-col items-center gap-2 group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
              action.grad
                ? 'bg-[linear-gradient(135deg,#3975E6,#9E4CC6)] shadow-lg shadow-primary/20'
                : 'bg-card border border-border/50 group-hover:bg-accent'
            }`}>
              <action.icon className={`w-5 h-5 ${action.grad ? 'text-white' : 'text-muted-foreground group-hover:text-primary'}`} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* 5. STATS GRID */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase">Pemasukan</span>
          </div>
          <p className="text-lg font-bold text-slate-800">{formatUang(totalIncome)}</p>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-red-500">
            <TrendingDown className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase">Pengeluaran</span>
          </div>
          <p className="text-lg font-bold text-slate-800">{formatUang(totalExpense)}</p>
        </Card>
      </div>

      {/* 6. RECENT TRANSACTIONS */}
      <Card>
        <div className="flex items-center justify-between p-5 pb-3">
          <h3 className="font-bold text-[hsl(225,20%,12%)]">Transaksi Terakhir</h3>
          <Link to="/transactions" className="text-xs text-blue-500 font-semibold flex items-center gap-1 hover:underline">
            Lihat Semua <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="px-5 pb-5">
          {transactions.slice(0, 5).map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 py-4 group border-b border-gray-200 last:border-0"
            >
              <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                {"📦"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-slate-800">
                  {tx.description}
                </p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  {format(new Date(tx.date), 'd MMM yyyy', { locale: idLocale })}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatUang(tx.amount)}
                </p>
                <Badge variant={tx.type === 'income' ? 'success' : 'secondary'} className="text-[9px] px-1.5 py-0 mt-0.5">
                  {"📦"}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

    </div>
  );
}