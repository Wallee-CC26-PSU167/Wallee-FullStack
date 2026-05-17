import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

import ButtonGrad from '../components/ui/buttongrad';
import SelectFields from '../components/ui/select';
import InputFields from '../components/ui/input';

const categories = {
  expense: [
    { value: "food", label: "🍕 Makanan" },
    { value: "transport", label: "🚗 Transportasi" },
    { value: "shopping", label: "🛍️ Belanja" },
    { value: "entertainment", label: "🎬 Hiburan" },
    { value: "bills", label: "📄 Tagihan" },
    { value: "health", label: "💊 Kesehatan" },
    { value: "education", label: "📚 Pendidikan" },
    { value: "other", label: "📦 Lainnya" },
  ],
  income: [
    { value: "salary", label: "💰 Gaji" },
    { value: "freelance", label: "💻 Freelance" },
    { value: "investment", label: "📈 Investasi" },
    { value: "gift", label: "🎁 Hadiah" },
    { value: "other", label: "📦 Lainnya" },
  ]
};

export default function AddTransaction() {
  const navigate = useNavigate();
  const [type, setType] = useState('expense');
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsPending(true);
    
    // Simulasi pengiriman data
    setTimeout(() => {
      console.log("Data Transaksi:", { ...form, type });
      alert("Transaksi berhasil disimpan (Simulasi)");
      setIsPending(false);
      navigate(-1);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto min-h-screen bg-background text-[hsl(225,20%,12%)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-xl hover:bg-muted transition-colors outline-none"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h1 className="text-xl font-bold">Tambah Transaksi</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Type Toggle - Pengganti logika CN dengan template literal */}
          <div className="flex gap-2 p-1 bg-gray-200 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => { setType('expense'); setForm(f => ({ ...f, category: '' })); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                type === 'expense' 
                ? "bg-white shadow-sm text-foreground" 
                : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => { setType('income'); setForm(f => ({ ...f, category: '' })); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                type === 'income' 
                ? "bg-white shadow-sm text-foreground" 
                : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Pemasukan
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-semibold px-1">Jumlah (Rp)</label>
            <InputFields
              type="number"
              placeholder="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="h-14 text-2xl font-bold text-center"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold px-1">Kategori</label>
            <div className="relative">
              <SelectFields 
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value })} 
                required
              >
                <option value="" disabled>Pilih kategori</option>
                {categories[type].map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </SelectFields>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold px-1">Deskripsi</label>
            <InputFields
              type="text"
              placeholder="Contoh: Makan siang di kantin"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-semibold px-1">Tanggal</label>
            <InputFields
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-sm font-semibold px-1">Catatan (opsional)</label>
            <textarea
              placeholder="Tambahkan catatan..."
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={3}
              className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          {/* Submit Button - Tetap dengan style gradient premium */}
          <ButtonGrad type="submit" disabled={isPending} className="w-full h-14 rounded-2xl font-bold">
          {isPending ? "Menyimpan..." : "Simpan Transaksi"}
          </ButtonGrad>
        </form>
      </motion.div>
    </div>
  );
}