import React, { useState } from 'react';
import { User, Bell, Palette, LogOut, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

// Dummy Data untuk tampilan statis
const DUMMY_USER = {
  full_name: "Pengguna Wallee",
  email: "halo@wallee.com"
};

export default function Settings() {
  const [currency, setCurrency] = useState('IDR');
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    alert('Pengaturan berhasil disimpan (Simulasi)');
  };

  const handleLogout = () => {
    alert('Keluar dari akun... (Simulasi)');
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6 min-h-screen bg-slate-50">
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
        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
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
              <input 
                type="text"
                value={DUMMY_USER.full_name} 
                disabled 
                className="w-full h-11 px-4 bg-slate-50 border border-gray-100/30 rounded-xl text-sm text-[hsl(220,10%,46%)] cursor-not-allowed outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium px-1">Alamat Email</label>
              <input 
                type="email"
                value={DUMMY_USER.email} 
                disabled 
                className="w-full h-11 px-4 bg-slate-50 border border-gray-100/30 rounded-xl text-sm text-[hsl(220,10%,46%)] cursor-not-allowed outline-none"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section: Preferensi */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.15 }}
      >
        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
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
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-gray-100/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="IDR">🇮🇩 IDR - Rupiah</option>
                  <option value="USD">🇺🇸 USD - Dollar</option>
                  <option value="EUR">🇪🇺 EUR - Euro</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[hsl(220,10%,46%)]" />
              </div>
            </div>

            {/* Notification Switch (Simulasi dengan Button Toggle) */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Notifikasi Pintar</p>
                <p className="text-xs text-[hsl(220,10%,46%)] mt-0.5">Terima pengingat & tips keuangan harian</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  notifications ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-4">
        <button 
          onClick={handleSave}
          className="bg-[linear-gradient(135deg,#3975E6,#9E4CC6)] w-full h-12 rounded-xl text-white font-semibold text-sm shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Simpan Perubahan
        </button>
        
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-2"
        >
          <LogOut className="w-4 h-4" />
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}