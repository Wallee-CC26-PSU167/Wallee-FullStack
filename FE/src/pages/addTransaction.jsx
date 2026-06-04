import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { createTransaction } from '../services/transactionService';
import { getCategories } from '../services/category_service';
import ButtonGrad from '../components/ui/buttongrad';
import SelectFields from '../components/ui/select';
import InputFields from '../components/ui/input';

// ── Helper ────────────────────────────────────────────────────
function formatCurrency(val) {
  if (!val) return 'Rp0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(val);
}

function newItem() {
  return { id: Date.now(), name: '', qty: 1, price: 0, category_id: '' };
}

// ── Label ─────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {children}
    </label>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function AddTransaction() {
  const navigate    = useNavigate();
  const [type,       setType]       = useState('expense');
  const [isPending,  setIsPending]  = useState(false);
  const [categories, setCategories] = useState([]);

  // Form untuk income (simple)
  const [incomeForm, setIncomeForm] = useState({
    amount:      '',
    category_id: '',
    description: '',
    date:        new Date().toISOString().split('T')[0],
    time:        new Date().toTimeString().slice(0, 5),
    note:        '',
  });

  // Form untuk expense (item-based)
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    date:        new Date().toISOString().split('T')[0],
    time:        new Date().toTimeString().slice(0, 5),
    note:        '',
  });
  const [items, setItems] = useState([newItem()]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCategories();
        console.log(data.data);
        setCategories(data.data);
      } catch (e) { console.log(e); }
    };
    load();
  }, []);

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories  = categories.filter(c => c.type === 'income');

  // ── Item helpers ──────────────────────────────────────────
  const addItem = () => setItems(prev => [...prev, newItem()]);

  const removeItem = (id) =>
    setItems(prev => prev.length > 1 ? prev.filter(i => i.id !== id) : prev);

  const updateItem = (id, field, value) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));

  // Total otomatis
  const total = items.reduce((sum, i) => sum + (Number(i.qty) * Number(i.price)), 0);

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    try {
      if (type === 'expense') {
        const payload = {
          type:        'expense',
          description: expenseForm.description,
          date:        expenseForm.date,
          time:        expenseForm.time,
          note:        expenseForm.note,
          amount:      total,
          items:       items.map(i => ({
            name:        i.name,
            qty:         Number(i.qty),
            price:       Number(i.price),
            category_id: i.category_id,
          })),
        };
        await createTransaction(payload);
      } else {
        const payload = {
          type:        'income',
          amount:      Number(incomeForm.amount),
          category_id: incomeForm.category_id,
          description: incomeForm.description,
          date:        incomeForm.date,
          time:        incomeForm.time,
          note:        incomeForm.note,
        };
        await createTransaction(payload);
      }
      navigate('/transaksi');
    } catch (err) {
      console.log(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto min-h-screen">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Transaksi baru</h1>
          <p className="text-xs text-gray-400">Input manual</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Type Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={[
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                type === 'expense'
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-400 hover:text-gray-600",
              ].join(' ')}
            >
              <TrendingDown className="w-4 h-4" />
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={[
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                type === 'income'
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-400 hover:text-gray-600",
              ].join(' ')}
            >
              <TrendingUp className="w-4 h-4" />
              Pemasukan
            </button>
          </div>

          {/* ── EXPENSE FORM ── */}
          {type === 'expense' && (
            <>
              <div>
                <Label>Nama toko</Label>
                <InputFields
                  type="text"
                  placeholder="cth. Alfamart, Warung Bu Sari"
                  value={expenseForm.description}
                  onChange={e => setExpenseForm(p => ({ ...p, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>Nama transaksi</Label>
                <textarea
                  placeholder="cth. Makan siang, Belanja bulanan"
                  value={expenseForm.note}
                  onChange={e => setExpenseForm(p => ({ ...p, note: e.target.value }))}
                  rows={3}
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all resize-none"
                />
              </div>

              {/* Tanggal & Waktu */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Tanggal</Label>
                  <InputFields
                    type="date"
                    value={expenseForm.date}
                    onChange={e => setExpenseForm(p => ({ ...p, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>Waktu</Label>
                  <InputFields
                    type="time"
                    value={expenseForm.time}
                    onChange={e => setExpenseForm(p => ({ ...p, time: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Tipe — expense sudah terpilih, label info */}
              <div>
                <Label>Tipe</Label>
                <div className="h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center text-sm text-gray-500">
                  Pengeluaran
                </div>
              </div>

              {/* Item transaksi */}
              <div>
                <Label>Item transaksi</Label>
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-3"
                    >
                      {/* Row 1: Nama item */}
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500 mb-1">Nama item</p>
                          <InputFields
                            type="text"
                            placeholder="Nama item"
                            value={item.name}
                            onChange={e => updateItem(item.id, 'name', e.target.value)}
                            required
                          />
                        </div>
                        {/* Tombol hapus item — hanya muncul jika lebih dari 1 */}
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="mt-6 p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Row 2: Qty & Harga */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-1">Qty</p>
                          <InputFields
                            type="number"
                            min="1"
                            placeholder="1"
                            value={item.qty}
                            onChange={e => updateItem(item.id, 'qty', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-1">Harga (Rp)</p>
                          <InputFields
                            type="number"
                            min="0"
                            placeholder="0"
                            value={item.price === 0 ? '' : item.price}
                            onChange={e => updateItem(item.id, 'price', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Row 3: Kategori */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Kategori</p>
                        <SelectFields
                          value={item.category_id}
                          onChange={e => updateItem(item.id, 'category_id', e.target.value)}
                          required
                        >
                          <option value="">Pilih kategori</option>
                          {expenseCategories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </SelectFields>
                      </div>

                      {/* Subtotal per item */}
                      {item.qty > 0 && item.price > 0 && (
                        <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                          <span className="text-xs text-gray-400">Subtotal</span>
                          <span className="text-xs font-bold text-gray-700">
                            {formatCurrency(Number(item.qty) * Number(item.price))}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Tombol tambah item */}
                  <button
                    type="button"
                    onClick={addItem}
                    className="w-full h-10 border border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah item
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-semibold text-gray-700">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(total)}
                </span>
              </div>
            </>
          )}

          {/* ── INCOME FORM ── */}
          {type === 'income' && (
            <>
              {/* Deskripsi */}
              <div>
                <Label>Nama toko</Label>
                <InputFields
                  type="text"
                  placeholder="cth. Alfamart, Warung Bu Sari"
                  value={expenseForm.description}
                  onChange={e => setExpenseForm(p => ({ ...p, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>Nama transaksi</Label>
                <textarea
                  placeholder="cth. Makan siang, Belanja bulanan"
                  value={expenseForm.note}
                  onChange={e => setExpenseForm(p => ({ ...p, note: e.target.value }))}
                  rows={3}
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all resize-none"
                />
              </div>

              {/* Tanggal & Waktu */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Tanggal</Label>
                  <InputFields
                    type="date"
                    value={incomeForm.date}
                    onChange={e => setIncomeForm(p => ({ ...p, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>Waktu</Label>
                  <InputFields
                    type="time"
                    value={incomeForm.time}
                    onChange={e => setIncomeForm(p => ({ ...p, time: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Jumlah */}
              <div>
                <Label>Jumlah (Rp)</Label>
                <InputFields
                  type="number"
                  placeholder="0"
                  value={incomeForm.amount}
                  onChange={e => setIncomeForm(p => ({ ...p, amount: e.target.value }))}
                  className="h-14 text-2xl font-bold text-center"
                  required
                />
              </div>

              {/* Kategori */}
              <div>
                <Label>Kategori</Label>
                <SelectFields
                  value={incomeForm.category_id}
                  onChange={e => setIncomeForm(p => ({ ...p, category_id: e.target.value }))}
                  required
                >
                  <option value="">Pilih kategori</option>
                  {incomeCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </SelectFields>
              </div>
            </>
          )}

          {/* Submit & Batal */}
          <div className="space-y-2 pt-2">
            <ButtonGrad
              type="submit"
              disabled={isPending}
              className="w-full h-13 rounded-2xl font-bold"
            >
              {isPending ? "Menyimpan..." : "Simpan transaksi"}
            </ButtonGrad>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full h-11 rounded-2xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}