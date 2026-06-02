import React, { useState, useEffect } from 'react';
import { User, Bell, Palette, LogOut, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../components/ui/Badge';
import SelectFields from '../components/ui/select';
import Button from '../components/ui/Button';
import { toast, Toaster } from "sonner";
import ButtonGrad from '../components/ui/buttongrad';
import Card from '../components/ui/card';
import InputFields from '../components/ui/input';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/user_service';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Settings() {
  const [form, setForm] = useState({
    nama: '',
    email: '',
    password_hash: '',
    currency: 'IDR',
  });
  const { logout } = useAuth();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('IDR');
  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setTimeout(() => {
        setUser(response.data);
        setForm({
          nama: response.data.nama || '',
          email: response.data.email || '',
          password_hash: '',
        });
      }, 0);
    } catch (error) {
      console.log(error);
      toast.error('Gagal memuat profil. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
  try {
    const response = await updateProfile(form);
    setUser(response.data);
    toast.success("Profile berhasil diperbarui");
  } catch (error) {
    console.log(error);
    toast.error("Gagal memperbarui profile");
  }
};

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Berhasil keluar');
    navigate("/login");
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6 min-h-screen bg-slate-50">

      <Toaster position="top-right" richColors />
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-[hsl(225,20%,12%)]">Pengaturan</h1>
        <p className="text-sm text-[hsl(220,10%,46%)] mt-1">Kelola akun dan preferensi Anda</p>
      </motion.div>

      {/* Section: Profil */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
      >
        <Card className='p-6'>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-[#3975E6] to-[#9E4CC6] p-2.5 rounded-xl">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-black">Profil</h2>
              <p className="text-xs text-[hsl(220,10%,46%)]">Informasi akun Anda</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium px-1">Nama Lengkap</label>
              <InputFields
                type="text"
                value={form.nama || ''}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium px-1">Alamat Email</label>
              <InputFields 
                type="email"
                value={form.email || ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium px-1">Kata Sandi</label>
              <InputFields 
                type="password"
                placeholder={'isikan password anda saat ini'}
                onChange={(e) => setForm({ ...form, password_hash: e.target.value })}
              />
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => navigate('/change-password')}
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                Ganti password akun
              </button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Section: Preferensi */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.15 }}
      >
        <Card className='p-6'>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-pink-50 p-2.5 rounded-xl">
              <Palette className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-black">Preferensi</h2>
              <p className="text-xs text-[hsl(220,10%,46%)]">Sesuaikan pengalaman Anda</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Currency Select */}
            <div className="space-y-1.5" style={{ marginTop: '8px' }}>
              <label className="text-sm font-medium px-1">Mata Uang Utama</label>
              <div className="relative">
                <SelectFields 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-11"
                >
                  <option value="IDR">🇮🇩 IDR - Rupiah</option>
                  <option value="USD">🇺🇸 USD - Dollar</option>
                  <option value="EUR">🇪🇺 EUR - Euro</option>
                </SelectFields>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[hsl(220,10%,46%)]" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-4">
        <ButtonGrad
          onClick={handleSave}
          className="w-full h-12 rounded-xl text-white font-semibold text-sm shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Simpan Perubahan
        </ButtonGrad>
        
        <Button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-2"
        >
          <LogOut className="w-4 h-4" />
          Keluar dari Akun
        </Button>
      </div>
    </div>
  );
}