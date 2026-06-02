import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../components/ui/card';
import SelectFields from '../components/ui/select';
import { getTransactions } from '../services/transactionService';

const COLORS = ['#3975E6', '#9E4CC6', '#34D399', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6'];

// ── Dummy forecast — ganti dengan API call saat model siap ───
const DUMMY_FORECAST = {
  user_id: 123,
  forecast_month: "2026-06",
  predicted_expense: 3150000,
  last_month_expense: 2900000,
  change_percentage: 8.62,
};

function formatCurrency(val) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(val);
}

function formatForecastMonth(str) {
  // "2026-06" → "Juni 2026"
  const [year, month] = str.split('-');
  const names = ["Januari","Februari","Maret","April","Mei","Juni",
                 "Juli","Agustus","September","Oktober","November","Desember"];
  return `${names[parseInt(month) - 1]} ${year}`;
}

// ── Forecast Card ─────────────────────────────────────────────
function ForecastCard({ forecast }) {
  const isUp = forecast.change_percentage >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl p-6 text-white relative overflow-hidden shadow-xl"
      style={{
        background: "linear-gradient(135deg, #3975E6, #9E4CC6)",
        boxShadow: "0 20px 40px rgba(57,117,230,0.25)",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-6 left-1/3 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-12 h-12 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10">

        {/* Label baris atas */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <p className="text-white/80 text-sm font-medium">
              Prediksi Pengeluaran AI
            </p>
          </div>
          <span className="text-xs text-white/60 bg-white/10 px-2.5 py-1 rounded-full">
            {formatForecastMonth(forecast.forecast_month)}
          </span>
        </div>

        {/* Nominal prediksi */}
        <p className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          {formatCurrency(forecast.predicted_expense)}
        </p>

        {/* Divider row */}
        <div className="flex items-center gap-6">

          {/* Bulan lalu */}
          <div>
            <p className="text-white/60 text-xs mb-1 uppercase tracking-wider font-semibold">
              Bulan Lalu
            </p>
            <p className="text-base font-bold">
              {formatCurrency(forecast.last_month_expense)}
            </p>
          </div>

          <div className="w-px h-10 bg-white/20 self-end mb-0.5" />

          {/* Perubahan % */}
          <div>
            <p className="text-white/60 text-xs mb-1 uppercase tracking-wider font-semibold">
              Perubahan
            </p>
            <div className="flex items-center gap-1">
              {isUp
                ? <ArrowUpRight className="w-4 h-4 text-red-300" />
                : <ArrowDownRight className="w-4 h-4 text-emerald-300" />
              }
              <p className={`text-base font-bold ${isUp ? 'text-red-300' : 'text-emerald-300'}`}>
                {isUp ? '+' : ''}{forecast.change_percentage.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Info label */}
          <div className="ml-auto text-right">
            <p className="text-white/40 text-[10px] leading-tight max-w-[100px]">
              Berdasarkan pola pengeluaran historis
            </p>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function Analytics() {
  const [period, setPeriod]         = useState('month');
  const [transactions, setTransactions] = useState([]);
  const [forecast, setForecast]     = useState(null);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTimeout(() => {
        setTransactions(data.data);
      }, 0);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch forecast — ganti dummy dengan API saat model siap
  const fetchForecast = async () => {
    try {
      // const res = await api.get("/ai/forecast");
      // setForecast(res.data);
      setForecast(DUMMY_FORECAST); // hapus baris ini saat API sudah siap
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchForecast();
  }, []);

  const now = new Date();
  const yearAgo = new Date();
  yearAgo.setFullYear(now.getFullYear() - 1);
  const filtered = transactions.filter(tx => {
    if (!tx.date) return false;
    const d = new Date(tx.date);
    if (period === 'month') {
      return d.getMonth() === yearAgo.getMonth() && d.getFullYear() === yearAgo.getFullYear();
    }
    if (period === 'month_ago') {
      const monthAgo = new Date(yearAgo);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return d >= monthAgo && d < yearAgo;
    }
    return true;
  });

  const totalIncome  = filtered.filter(t => t.type === 'income').reduce((s, t) => s + parseFloat(t.amount), 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + parseFloat(t.amount), 0);

  const categoryData = Object.entries(
    filtered.filter(t => t.type === 'expense').reduce((acc, t) => {
      const name = t?.category_name || "Lainnya";
      acc[name] = (acc[name] || 0) + parseFloat(t.amount);
      return acc;
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const dailyData = filtered
    .reduce((acc, t) => {
      const day = new Date(t.date).getDate().toString();
      const existing = acc.find(i => i.date === day);
      if (existing) {
        if (t.type === 'income') existing.income  += parseFloat(t.amount);
        else                     existing.expense += parseFloat(t.amount);
      } else {
        acc.push({
          date:    day,
          income:  t.type === 'income'  ? parseFloat(t.amount) : 0,
          expense: t.type === 'expense' ? parseFloat(t.amount) : 0,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => parseInt(a.date) - parseInt(b.date));

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analitik</h1>
          <p className="text-sm text-gray-400">Pantau kesehatan keuangan Anda</p>
        </div>
        <div className="relative">
          <SelectFields
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="appearance-none w-30 text-xs"
          >
            <option value="month">Bulan Ini</option>
            <option value="month_ago">Bulan Lalu</option>
          </SelectFields>
        </div>
      </div>

      {/* Forecast Card */}
      {forecast && <ForecastCard forecast={forecast} />}

      {/* Bar Chart */}
      <Card className="p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold flex items-center gap-2 text-gray-800">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            Tren Transaksi Harian
          </h3>
        </div>
        {dailyData.length === 0 ? (
          <div className="py-10 flex items-center justify-center text-sm text-gray-400">
            Tidak ada transaksi untuk periode ini
          </div>
        ) : (
          <>
            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    formatter={(value) => [formatCurrency(value), ""]}
                    contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="income"  fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={15} />
                  <Bar dataKey="expense" fill="#3975E6" radius={[4, 4, 0, 0]} maxBarSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-gray-400">Pemasukan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3975E6]" />
                <span className="text-[10px] text-gray-400">Pengeluaran</span>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Pie Chart */}
      <Card className="p-6 border border-gray-100">
        <h3 className="text-sm font-bold mb-6 text-gray-800">Distribusi Pengeluaran</h3>
        {categoryData.length === 0 ? (
          <div className="py-10 flex items-center justify-center text-sm text-gray-400">
            Tidak ada pengeluaran untuk periode ini
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full max-w-[200px] h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                    {categoryData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 w-full grid grid-cols-1 gap-3">
              {categoryData.slice(0, 5).map((cat, i) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{cat.name}</p>
                      <p className="text-[10px] text-gray-400">Kategori Pengeluaran</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{formatCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}