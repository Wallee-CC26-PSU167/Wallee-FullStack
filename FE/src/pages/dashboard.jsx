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
// Ganti dengan API call ke backend saat sudah siap
// Urutkan dari yang terbaru (index 0 = paling baru)
const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    message: "Pengeluaran untuk kategori Makanan bulan ini sudah mencapai 80% dari rata-rata bulananmu. Pertimbangkan untuk memasak di rumah beberapa hari ke depan.",
    createdAt: new Date(),               // terbaru — ini yang ditampilkan
    isRead: false,
  },
  {
    id: 2,
    message: "Selamat! Kamu berhasil menabung 20% lebih banyak dibanding bulan lalu. Pertahankan kebiasaan ini!",
    createdAt: new Date(Date.now() - 86400000),
    isRead: true,
  },
  {
    id: 3,
    message: "Tagihan listrik bulan ini lebih tinggi 15% dari biasanya. Cek penggunaan perangkat elektronikmu.",
    createdAt: new Date(Date.now() - 172800000),
    isRead: true,
  },
];

// ── AI Notification Banner ────────────────────────────────────
function AINotificationBanner({ notification, onDismiss }) {
  if (!notification) return null;

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
        {/* Glow accent */}
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
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "#3975E6" }}
              >
                AI Insight
              </span>
              {!notification.isRead && (
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#9E4CC6" }}
                />
              )}
              <span className="text-[10px] text-gray-400 ml-auto flex-shrink-0">
                {format(new Date(notification.createdAt), 'd MMM, HH:mm', { locale: idLocale })}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {notification.message}
            </p>

            {/* CTA ke AI Chat */}
            <Link
              to="/aichat"
              className="inline-flex items-center gap-1 mt-2 text-xs font-semibold"
              style={{ color: "#3975E6" }}
            >
              Tanya AI lebih lanjut
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
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

  // Ambil notifikasi terbaru saat mount
  useEffect(() => {
    // Ganti dengan: const res = await api.get("/notifications/latest")
    // dan setNotification(res.data)
    const latest = DUMMY_NOTIFICATIONS[0]; // index 0 = paling baru
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotification(latest);
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
        className="flex items-center justify-between relative overflow-hidden"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[hsl(225,20%,12%)]">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Ringkasan keuangan Anda hari ini</p>
        </div>

        {/* Bell icon — badge merah jika ada notif belum dibaca */}
        <div className="relative">
          <button className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-sm">
            <Bell className="w-5 h-5" />
          </button>
          {notification && !notification.isRead && (
            <span className="absolute -top-1 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          )}
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
      <AINotificationBanner
        notification={notification}
        onDismiss={() => setNotification(null)}
      />

      {/* 4. STATS GRID */}
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

      {/* 5. RECENT TRANSACTIONS */}
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