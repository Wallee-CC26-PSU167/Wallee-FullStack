import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, TrendingUp, TrendingDown, ArrowLeftRight, 
  Plus, BarChart3, MessageSquare, ChevronRight, 
  Eye, EyeOff 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

// --- DUMMY DATA (Simulasi Data Backend) ---
const DUMMY_TRANSACTIONS = [
  { id: '1', type: 'income', amount: 5000000, category: 'salary', description: 'Gaji Bulanan', date: new Date().toISOString() },
  { id: '2', type: 'expense', amount: 85000, category: 'food', description: 'Makan Bakso', date: new Date().toISOString() },
  { id: '3', type: 'expense', amount: 150000, category: 'transport', description: 'Bensin Mobil', date: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', type: 'expense', amount: 1200000, category: 'bills', description: 'Tagihan Listrik', date: new Date(Date.now() - 172800000).toISOString() },
  { id: '5', type: 'income', amount: 500000, category: 'freelance', description: 'Proyek Desain', date: new Date(Date.now() - 259200000).toISOString() },
];

const categoryLabels = {
  food: "Makanan", transport: "Transportasi", shopping: "Belanja",
  entertainment: "Hiburan", bills: "Tagihan", salary: "Gaji",
  freelance: "Freelance", other: "Lainnya"
};

const categoryIcons = {
  food: "🍕", transport: "🚗", shopping: "🛍️", entertainment: "🎬",
  bills: "📄", salary: "💰", freelance: "💻", other: "📦"
};

export default function Dashboard() {
  const [transactions] = useState(DUMMY_TRANSACTIONS);
  const [balanceHidden, setBalanceHidden] = useState(false);

  // Perhitungan Statis
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const formatCurrency = (val) => {
    if (balanceHidden) return "••••••••";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };
  const format = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6 bg-background min-h-screen">
      
      {/* 1. HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[hsl(225,20%,12%)]">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Ringkasan keuangan Anda hari ini</p>
        </div>
      </motion.div>

      {/* 2. BALANCE CARD (Gabungan BalanceCard.jsx) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[linear-gradient(135deg,#3975E6,#9E4CC6)] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20"
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#3975E6,#9E4CC6)]" />
        <div className="relative">
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

      {/* 3. QUICK ACTIONS (Gabungan QuickAction.jsx) */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Plus, label: "Tambah", path: "/add-transaction", grad: true },
          { icon: ArrowLeftRight, label: "Riwayat", path: "/transactions" },
          { icon: BarChart3, label: "Analitik", path: "/analytics" },
          { icon: MessageSquare, label: "AI Chat", path: "/chat" },
        ].map((action, i) => (
          <Link key={i} to={action.path} className="flex flex-col items-center gap-2 group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
              action.grad ? 'bg-[linear-gradient(135deg,#3975E6,#9E4CC6)] shadow-lg shadow-primary/20' : 'bg-card border border-border/50 group-hover:bg-accent'
            }`}>
              <action.icon className={`w-5 h-5 ${action.grad ? 'text-white' : 'text-muted-foreground group-hover:text-primary'}`} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* 4. STATS GRID (Income & Expense Month summary) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-card border border-border/50 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase">Pemasukan</span>
          </div>
          <p className="text-lg font-bold text-slate-800">{format(totalIncome)}</p>
        </div>
        <div className="p-4 bg-card border border-border/50 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-red-500">
            <TrendingDown className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase">Pengeluaran</span>
          </div>
          <p className="text-lg font-bold text-slate-800">{format(totalExpense)}</p>
        </div>
      </div>

      {/* 5. RECENT TRANSACTIONS (Gabungan RecentTransactions.jsx menggunakan Tag HTML) */}
      <div className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-3">
          <h3 className="font-bold text-[hsl(225,20%,12%)]">Transaksi Terakhir</h3>
          <Link to="/transactions" className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
            Lihat Semua <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        
        <div className="px-5 pb-5 divide-y divide-border/30">
          {transactions.slice(0, 5).map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 py-4 group"
            >
              <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                {categoryIcons[tx.category] || "📦"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-slate-800">
                  {tx.description || categoryLabels[tx.category]}
                </p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  {format(new Date(tx.date), 'd MMM yyyy', { locale: idLocale })}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {tx.type === 'income' ? '+' : '-'}{format(tx.amount)}
                </p>
                <p className="text-[9px] text-muted-foreground italic">{categoryLabels[tx.category]}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}