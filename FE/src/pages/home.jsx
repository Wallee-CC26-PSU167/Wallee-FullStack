import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import { ArrowRight, LineChart, Sparkles, PieChart, Bot, Star, Receipt } from 'lucide-react';
import maskotWallee from '../assets/Maskot Wallee.png';
import { ParticlesBG } from '../components/ui/BackgroundStyles';

import Header from '../components/layout/header';
import Footer from '../components/layout/footer';

export function HomeSection() {
  return (
    <section className="w-full pt-20 pb-24" id="home">

      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 mb-24">
          <div className="w-full lg:w-7/12 xl:w-1/2 flex-shrink-0 z-20" data-aos="fade-right">
            {/* Typography */}
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-bold text-black mb-8 tracking-tight leading-[1.1] font-serif">
              <span className="whitespace-nowrap">Smart Money</span><br />
              <span className="bg-gradient-to-br from-blue-500 to-purple-500 text-transparent bg-clip-text">Happy life</span>
            </h1>

            <p className="text-slate-500 text-lg md:text-xl mb-12 leading-relaxed max-w-2xl font-medium">
              Wallee membantu kamu memahami, merencanakan, dan mengoptimalkan pengeluaran dengan lebih cerdas menggunakan teknologi AI.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center space-x-8">
              <Link to="/register">
                <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold px-7 py-3.5 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5">
                  Mulai Gratis <ArrowRight size={20} strokeWidth={2.5} />
                </button>
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-5/12 xl:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0 relative" data-aos="fade-left" data-aos-delay="200">
            <img src={maskotWallee} alt="Maskot Wallee" className="w-[110%] md:w-full max-w-[600px] lg:max-w-none object-contain drop-shadow-2xl hover:-translate-y-2 scale-110 lg:scale-150 xl:scale-[1.35] lg:translate-x-16 xl:translate-x-20 transition-all duration-500 z-10" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="300">
          {/* Stat 1 */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-4xl font-bold text-slate-900 mb-3 font-serif tracking-tight">1 dari 3</h3>
            <p className="text-gray-600 text-sm leading-relaxed font-medium">
              orang Indonesia tidak punya tabungan darurat
            </p>
          </div>

          {/* Stat 2 */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-4xl font-bold text-slate-900 mb-3 font-serif tracking-tight">68%</h3>
            <p className="text-gray-600 text-sm leading-relaxed font-medium">
              keluarga tidak pernah merencanakan keuangan
            </p>
          </div>

          {/* Stat 3 */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-4xl font-bold text-slate-900 mb-3 font-serif tracking-tight">Rp 0</h3>
            <p className="text-gray-600 text-sm leading-relaxed font-medium">
              yang disisihkan oleh rata-rata pekerja muda
            </p>
          </div>
        </div>
      </section>

    </section>
  );
}

export function Feature() {
  return (
    <section id="feature" className="bg-transparent text-left pt-25 pb-24 px-4 w-full relative z-10">
      <div className="max-w-5xl mx-auto text-left mb-12" data-aos="fade-up">
        <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
          FITUR
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6 leading-tight">
          Semua yang kamu butuhkan, <br className="hidden md:block" /> dalam satu tempat.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Feature 1 */}
        <div data-aos="fade-up" data-aos-delay="100" className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start text-left">
          <div className="bg-orange-50 text-orange-500 rounded-full mb-6 w-16 h-16 flex items-center justify-center">
            <LineChart size={32} strokeWidth={2} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Prediksi Keuangan</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Proyeksikan kondisi arus kas masa depanmu berdasarkan pola transaksi harian.
          </p>
        </div>

        {/* Feature 2 */}
        <div data-aos="fade-up" data-aos-delay="200" className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start text-left">
          <div className="bg-emerald-50 text-emerald-600 rounded-full mb-6 w-16 h-16 flex items-center justify-center">
            <Bot size={32} strokeWidth={2} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Deteksi Anomali</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Deteksi pengeluaran tidak wajar secara otomatis dan dapatkan rekomendasi keuangan yang bijak.
          </p>
        </div>

        {/* Feature 3 */}
        <div data-aos="fade-up" data-aos-delay="300" className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start text-left">
          <div className="bg-purple-50 text-purple-600 rounded-full mb-6 w-16 h-16 flex items-center justify-center">
            <PieChart size={32} strokeWidth={2} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Laporan Otomatis</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Pantau ringkasan keuanganmu melalui grafik visual yang praktis dan mudah dipahami.
          </p>
        </div>

        {/* Feature 4 */}
        <div data-aos="fade-up" data-aos-delay="400" className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start text-left">
          <div className="bg-blue-50 text-blue-600 rounded-full mb-6 w-16 h-16 flex items-center justify-center">
            <Receipt size={32} strokeWidth={2} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Kelola Transaksi</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Catat, lacak, dan kategorikan seluruh transaksi harianmu dengan mudah di satu tempat.
          </p>
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Andi Saputra",
    img: "https://i.pravatar.cc/150?img=11",
    text: "Wallee otomatis mengatur pengeluaran saya dengan sempurna. Tidak perlu pusing lagi dengan catatan manual.",
    isGradient: true
  },
  {
    name: "Dewi Anggraini",
    img: "https://i.pravatar.cc/150?img=5",
    text: "Saya hanya perlu memotret setelah makan bisnis dan pengeluaran langsung tercatat. Sangat efisien!",
    isGradient: false
  },
  {
    name: "Joko Widodo",
    img: "https://i.pravatar.cc/150?img=3",
    text: "Laporan otomatisnya sangat membantuku memahami ke mana saja uangku pergi bulan ini.",
    isGradient: true
  },
  {
    name: "Budi Santoso",
    img: "https://i.pravatar.cc/150?img=8",
    text: "Prediksi keuangannya akurat! Sekarang aku punya tabungan darurat berkat rekomendasi Wallee.",
    isGradient: false
  }
];

const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

export function Testimoni() {
  return (
    <section id="testimoni" className="bg-transparent text-center py-24 w-full overflow-hidden relative z-10">
      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: scroll-left 100s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
          .animate-marquee-reverse {
            display: flex;
            width: max-content;
            animation: scroll-left 100s linear infinite reverse;
          }
          .animate-marquee-reverse:hover {
            animation-play-state: paused;
          }
        `}
      </style>
      <div className="px-4" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Apa Kata Mereka?</h2>
        <p className="text-gray-500 mb-12 max-w-xl mx-auto">
          Kendalikan keuangan Anda dengan Wallee. Lacak pengeluaran dan menabung lebih cerdas dalam satu aplikasi praktis.
        </p>
      </div>

      <div className="relative w-full flex flex-col gap-8">
        {/* Row 1: Kanan ke Kiri */}
        <div className="animate-marquee" data-aos="fade-in" data-aos-delay="200">
          {/* Block 1 */}
          <div className="flex gap-8 pr-8">
            {extendedTestimonials.map((t, idx) => (
              <div 
                key={`r1-b1-${idx}`} 
                className={`rounded-2xl p-8 w-[320px] md:w-[350px] flex-shrink-0 text-left transition-shadow ${
                  t.isGradient 
                    ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl" 
                    : "bg-gray-50 text-slate-900 border border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 flex-shrink-0 rounded-full overflow-hidden ${t.isGradient ? 'border-2 border-white/30' : ''}`}>
                    <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${t.isGradient ? 'text-white' : 'text-slate-900'}`}>{t.name}</h4>
                    <div className={`flex mt-1 ${t.isGradient ? 'text-yellow-300' : 'text-yellow-400'}`}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" className="mr-0.5" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className={`font-medium leading-relaxed text-lg ${t.isGradient ? 'text-white/95' : 'text-slate-800'}`}>
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
          {/* Block 2 (Duplicate for seamless loop) */}
          <div className="flex gap-8 pr-8">
            {extendedTestimonials.map((t, idx) => (
              <div 
                key={`r1-b2-${idx}`} 
                className={`rounded-2xl p-8 w-[320px] md:w-[350px] flex-shrink-0 text-left transition-shadow ${
                  t.isGradient 
                    ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl" 
                    : "bg-gray-50 text-slate-900 border border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 flex-shrink-0 rounded-full overflow-hidden ${t.isGradient ? 'border-2 border-white/30' : ''}`}>
                    <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${t.isGradient ? 'text-white' : 'text-slate-900'}`}>{t.name}</h4>
                    <div className={`flex mt-1 ${t.isGradient ? 'text-yellow-300' : 'text-yellow-400'}`}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" className="mr-0.5" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className={`font-medium leading-relaxed text-lg ${t.isGradient ? 'text-white/95' : 'text-slate-800'}`}>
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Kiri ke Kanan */}
        <div className="animate-marquee-reverse" data-aos="fade-in" data-aos-delay="400">
          {/* Block 1 */}
          <div className="flex gap-8 pr-8">
            {[...extendedTestimonials].reverse().map((t, idx) => (
              <div 
                key={`r2-b1-${idx}`} 
                className={`rounded-2xl p-8 w-[320px] md:w-[350px] flex-shrink-0 text-left transition-shadow ${
                  t.isGradient 
                    ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl" 
                    : "bg-gray-50 text-slate-900 border border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 flex-shrink-0 rounded-full overflow-hidden ${t.isGradient ? 'border-2 border-white/30' : ''}`}>
                    <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${t.isGradient ? 'text-white' : 'text-slate-900'}`}>{t.name}</h4>
                    <div className={`flex mt-1 ${t.isGradient ? 'text-yellow-300' : 'text-yellow-400'}`}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" className="mr-0.5" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className={`font-medium leading-relaxed text-lg ${t.isGradient ? 'text-white/95' : 'text-slate-800'}`}>
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
          {/* Block 2 (Duplicate for seamless loop) */}
          <div className="flex gap-8 pr-8">
            {[...extendedTestimonials].reverse().map((t, idx) => (
              <div 
                key={`r2-b2-${idx}`} 
                className={`rounded-2xl p-8 w-[320px] md:w-[350px] flex-shrink-0 text-left transition-shadow ${
                  t.isGradient 
                    ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl" 
                    : "bg-gray-50 text-slate-900 border border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 flex-shrink-0 rounded-full overflow-hidden ${t.isGradient ? 'border-2 border-white/30' : ''}`}>
                    <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${t.isGradient ? 'text-white' : 'text-slate-900'}`}>{t.name}</h4>
                    <div className={`flex mt-1 ${t.isGradient ? 'text-yellow-300' : 'text-yellow-400'}`}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" className="mr-0.5" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className={`font-medium leading-relaxed text-lg ${t.isGradient ? 'text-white/95' : 'text-slate-800'}`}>
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section id="about" data-aos="fade-up" className="w-full bg-transparent py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 text-center">
        <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
          TANTANGAN FINANSIAL
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6 leading-tight">
          Kegagalan finansial bukan soal malas.<br className="hidden md:block" />
          <span className="bg-gradient-to-br from-blue-500 to-purple-500 text-transparent bg-clip-text"> Tapi soal akses. </span>
        </h2>
        <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
          Tidak semua orang punya akses ke konsultan finansial mahal. Akibatnya, banyak yang baru
          sadar kesalahan mereka ketika sudah terlambat, hutang menumpuk, tabungan nol, dan
          masa depan terancam.
        </p>

        {/* Solusi Kami Card */}
        <div className="mt-16 bg-gray-50 shadow-xl shadow-gray-200/60 hover:shadow-2xl hover:shadow-gray-200/80 transition-all duration-500 rounded-[2rem] p-8 md:p-12 lg:p-16 text-left grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border border-gray-100">
          <div>
            <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
              SOLUSI KAMI
            </span>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-6 leading-tight">
              Demokratisasi kecerdasan finansial untuk semua orang Indonesia.
            </h3>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Wallee hadir sebagai teman finansial yang paling dekat, paling jujur, dan paling cocok denganmu, bukan hanya untuk orang kaya.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-6 py-3 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5">
              Coba Sekarang <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 shadow-md shadow-gray-200/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:shadow-lg hover:shadow-gray-200 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4">
                <Receipt size={24} />
              </div>
              <span className="text-slate-800 font-semibold">Kelola Transaksi</span>
            </div>

            <div className="bg-white border border-gray-100 shadow-md shadow-gray-200/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:shadow-lg hover:shadow-gray-200 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4">
                <Bot size={24} />
              </div>
              <span className="text-slate-800 font-semibold">Deteksi Anomali</span>
            </div>

            <div className="bg-white border border-gray-100 shadow-md shadow-gray-200/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:shadow-lg hover:shadow-gray-200 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 mb-4">
                <LineChart size={24} />
              </div>
              <span className="text-slate-800 font-semibold">Prediksi Keuangan</span>
            </div>

            <div className="bg-white border border-gray-100 shadow-md shadow-gray-200/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:shadow-lg hover:shadow-gray-200 hover:-translate-y-1 transition-all duration-300">
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
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <>
      <ParticlesBG className="w-full min-h-screen font-sans">
        <Header />
        <HomeSection />
        <AboutSection />
        <Feature />
        <Testimoni />
      </ParticlesBG>
      <Footer />
    </>
  );
}