import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Trash2, ArrowLeftRight } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from "sonner";
import InputFields from '../components/ui/input';
import SelectFields from '../components/ui/select';
import Card from '../components/ui/card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/button';
import ButtonGrad from '../components/ui/buttongrad';
import { getTransactions } from '../services/transactionService';
import { deleteTransaction } from '../services/transactionService';
import { getCategories } from '../services/category_service';

function formatCurrency(val) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(val);
}

export default function Transactions() {
  const [search,          setSearch]          = useState('');
  const [filterType,      setFilterType]      = useState('all');
  const [filterCategory,  setFilterCategory]  = useState('all');
  const [transactions,    setTransactions]    = useState([]);
  const [categories, setCategories] = useState([]);
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.data);
  
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.data);
      } catch (error) {
        console.log(error);
      }
    };
      loadCategories();
    }, []);
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

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      fetchTransactions();
      toast.success('Transaksi berhasil dihapus');
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const filtered = transactions.filter(tx => {
    const matchSearch   = !search || tx.description?.toLowerCase().includes(search.toLowerCase());
    const matchType     = filterType     === 'all' || tx.type     === filterType;
    const matchCategory = filterCategory === 'all' || tx.category_name === filterCategory;
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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transaksi</h1>
          <p className="text-sm text-gray-400">Lihat riwayat keuangan Anda</p>
        </div>
        <Link to="/add-transaction">
          <ButtonGrad
            size="sm"
            className="px-4 h-9 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-1" /> Tambah
          </ButtonGrad>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <InputFields
            placeholder="Cari transaksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <SelectFields
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="sm:w-48"
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
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.name}
              >
                {category.name}
              </option>
            ))}
        </SelectFields>
      </div>

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

                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl shrink-0">
                          {"📦"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate text-gray-800">
                            {tx.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge>{tx.category_name}</Badge>
                          </div>
                        </div>

                        <div className="text-right shrink-0 mr-2">
                          <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-gray-800'}`}>
                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                          </p>
                        </div>

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