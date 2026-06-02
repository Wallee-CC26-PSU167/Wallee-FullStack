import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LineChart, Sparkles, PieChart, Bot, Star, Receipt } from 'lucide-react';

import Header from '../components/layout/header';
import Footer from '../components/layout/footer';

export function HomeSection() {
  return (
    <div id="home" className="flex flex-col justify-center bg-white w-full min-h-screen pt-20 pb-24">

      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
        {/* Typography */}
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-black mb-8 tracking-tight leading-[1.1] font-serif">
          Smart Money<br className="hidden md:block" />
          <span className="bg-gradient-to-br from-blue-500 to-purple-500 text-transparent bg-clip-text">Happy life</span>
        </h1>

        <p className="text-slate-500 text-lg md:text-xl mb-12 leading-relaxed max-w-2xl font-medium">
          Wallee membantu kamu memahami, merencanakan, dan mengoptimalkan pengeluaran dengan lebih cerdas menggunakan teknologi AI.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center space-x-8 mb-24">
          <Link to="/register">
            <button className="flex items-center gap-2 bg-[#e3e9e8] text-[#1f2729] font-bold px-7 py-3.5 rounded-full hover:bg-white transition-all hover:shadow-lg">
              Mulai Gratis <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat 1 */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-8">
            <h3 className="text-4xl font-bold text-white mb-3 font-serif tracking-tight">1 dari 3</h3>
            <p className="text-white text-sm leading-relaxed font-medium">
              orang Indonesia tidak punya tabungan darurat
            </p>
          </div>

          {/* Stat 2 */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-8">
            <h3 className="text-4xl font-bold text-white mb-3 font-serif tracking-tight">68%</h3>
            <p className="text-white text-sm leading-relaxed font-medium">
              keluarga tidak pernah merencanakan keuangan
            </p>
          </div>

          {/* Stat 3 */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-8">
            <h3 className="text-4xl font-bold text-white mb-3 font-serif tracking-tight">Rp 0</h3>
            <p className="text-white text-sm leading-relaxed font-medium">
              yang disisihkan oleh rata-rata pekerja muda
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

export function Feature() {
  return (
    <section id="feature" className="text-center py-16 px-4 w-full">
      <h2 className="text-3xl font-bold text-slate-900 mb-12">Kenapa Memilih Kami?</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Feature 1 */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
          <div className="text-blue-500 mb-6 w-16 h-16 flex items-center justify-center">
            <LineChart size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Tracking Keuangan</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Catat pemasukan dan pengeluaran harian dengan mudah dan terstruktur.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
          <div className="text-blue-500 mb-6 w-16 h-16 flex items-center justify-center">
            <Sparkles size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Analisis AI</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Dapatkan insight otomatis tentang pola pengeluaranmu dan rekomendasi yang lebih bijak.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
          <div className="text-blue-500 mb-6 w-16 h-16 flex items-center justify-center">
            <PieChart size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Laporan Otomatis</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Lihat laporan keuangan dalam bentuk grafik yang mudah dipahami kapan saja.
          </p>
        </div> 
      </div>
    </section>
  );
}

export function Testimoni() {
    return (
        <section className="text-center py-16 px-4 w-full">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Apa Kata Mereka?</h2>
            <p className="text-gray-500 mb-12 max-w-xl mx-auto">
                Kendalikan keuangan Anda dengan Wallee. Lacak pengeluaran dan menabung lebih cerdas dalam satu aplikasi praktis.
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center max-w-5xl mx-auto">
                {/* Card 1 */}
                <div className="bg-gray-50/80 rounded-2xl p-6 w-full md:w-96 text-left border border-gray-100">
                    <div className="w-10 h-10 rounded-full overflow-hidden mb-4">
                        <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex text-yellow-400 mb-3">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill="currentColor" className="mr-1" />
                        ))}
                    </div>
                    <p className="text-slate-900 font-semibold leading-snug">
                        Wallee otomatis mengatur pengeluaran saya dengan sempurna.
                    </p>
                </div>

                {/* Card 2 */}
                <div className="bg-gray-50/80 rounded-2xl p-6 w-full md:w-96 text-left border border-gray-100">
                    <div className="w-10 h-10 rounded-full overflow-hidden mb-4">
                        <img src="https://i.pravatar.cc/150?img=5" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex text-yellow-400 mb-3">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill="currentColor" className="mr-1" />
                        ))}
                    </div>
                    <p className="text-slate-900 font-semibold leading-snug">
                        Saya hanya perlu memotret setelah makan bisnis dan pengeluaran langsung tercatat.
                    </p>
                </div>
            </div>
        </section>
    );
}

export function AboutSection() {
  return (
    <section id="about" className="w-full bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 text-center">
        <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
          MASALAHNYA NYATA
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6 leading-tight">
          Kegagalan finansial bukan soal malas.<br className="hidden md:block" />
          <span className="bg-gradient-to-br from-blue-500 to-purple-500 text-transparent bg-clip-text"> Tapi soal akses. </span>
        </h2>
        <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
          Tidak semua orang punya akses ke konsultan finansial mahal. Akibatnya, banyak yang baru
          sadar kesalahan mereka ketika sudah terlambat — hutang menumpuk, tabungan nol, dan
          masa depan terancam.
        </p>

        {/* Solusi Kami Card */}
        <div className="mt-16 bg-gray-100 rounded-[2rem] p-8 md:p-12 lg:p-16 text-left grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
              SOLUSI KAMI
            </span>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-6 leading-tight">
              Demokratisasi kecerdasan finansial untuk semua orang Indonesia.
            </h3>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Wallee hadir sebagai teman finansial yang paling dekat, paling jujur, dan paling cocok denganmu — bukan hanya untuk orang kaya.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-6 py-3 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5">
              Coba Sekarang <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4">
                <Receipt size={24} />
              </div>
              <span className="text-slate-800 font-semibold">Kelola Transaksi</span>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4">
                <Bot size={24} />
              </div>
              <span className="text-slate-800 font-semibold">Deteksi Anomali</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 mb-4">
                <LineChart size={24} />
              </div>
              <span className="text-slate-800 font-semibold">Prediksi Keuangan</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 mb-4">
                <PieChart size={24} />
              </div>
              <span className="text-slate-800 font-semibold">Laporan Otomatis</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <div className="w-full min-h-screen bg-slate-50 overflow-x-hidden font-sans">
        <HomeSection />
        <AboutSection />
        <Feature />
        <Testimoni />
      </div>
      <Footer />
    </>
  );
}