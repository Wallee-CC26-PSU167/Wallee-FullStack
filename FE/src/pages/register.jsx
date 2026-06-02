import { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Receipt, Bot, LineChart, PieChart } from "lucide-react";
import WalleeLogo from "../assets/Logo_Full.png";
import Card from "../components/ui/card";
import ButtonGrad from "../components/ui/buttongrad";
import InputFields from "../components/ui/input";
import { registerUser } from "../services/auth_service";

const FEATURES = [
  { Icon: Receipt,    label: "Kelola Transaksi" },
  { Icon: Bot,        label: "Deteksi Anomali" },
  { Icon: LineChart,  label: "Prediksi Keuangan" },
  { Icon: PieChart,   label: "Laporan Otomatis" },
];

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [form,    setForm]    = useState({ name: "", email: "", password: "" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr,  setApiErr]  = useState("");

  function set(field) {
    return (e) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: "" }));
      setApiErr("");
    };
  }

  function validate() {
    const e = {};
    if (!form.name.trim())                      e.name     = "Nama tidak boleh kosong";
    if (!form.email)                            e.email    = "Email tidak boleh kosong";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email    = "Format email tidak valid";
    if (!form.password)                         e.password = "Password tidak boleh kosong";
    else if (form.password.length < 6)          e.password = "Minimal 6 karakter";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setApiErr("");
    try {
      const response = await registerUser(form);
      navigate("/dashboard");
    } catch (err) {
      setApiErr(err.message ?? "Registrasi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (field) => [
    "w-full px-3.5 py-2.5 rounded-[10px] border bg-white text-sm outline-none transition-all placeholder:text-gray-400",
    errors[field]
      ? "border-red-400 ring-4 ring-red-500/10"
      : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
  ].join(" ");

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center p-4 sm:p-6">
      <div 
        data-aos="zoom-in" data-aos-duration="600"
        className="w-full max-w-[880px] bg-white rounded-2xl overflow-hidden shadow-[0_8px_48px_rgba(15,24,41,0.12)] hover:shadow-[0_16px_60px_rgba(15,24,41,0.2)] transition-shadow duration-500 flex"
      >

        <div className="hidden lg:flex flex-col w-[42%] flex-shrink-0 p-9 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(44, 114, 245, 0.47) 0%, rgba(176, 52, 238, 0.48) 100%)" }}
        >
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-0.5 rounded bg-gradient-to-r from-[#3975E6] to-[#9E4CC6]" />
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest">
                Personal Finance AI
              </span>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 leading-snug mb-3">
              Smart Money,<br /> Happy Life.
            </h2>

            <p className="text-sm text-slate-800 leading-relaxed mb-8 font-medium">
              Wallee membantu kamu memahami, merencanakan, dan mengoptimalkan pengeluaran dengan lebih cerdas menggunakan teknologi AI.
            </p>

            <div className="flex flex-col gap-3 mb-10">
              {FEATURES.map(({ Icon, label }, idx) => (
                <div key={label} data-aos="fade-right" data-aos-delay={200 + idx * 100} className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/40 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 cursor-default">
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    <Icon size={16} className="text-blue-600" strokeWidth={2} />
                  </div>
                  <span className="text-sm text-slate-800 font-bold group-hover:text-blue-900 transition-colors">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-10 sm:px-12">
          <div className="w-full max-w-[340px]">

            <div className="flex justify-center mb-6">
                <img src={WalleeLogo} alt="Wallee Logo" className="h-16 w-auto hover:scale-105 hover:drop-shadow-md transition-all duration-300" />
            </div>

            <div className="mb-7">
              <h1 className="text-2xl font-bold text-gray-900 mb-1.5 text-center">
                Buat akun baru 
              </h1>
              <p className="text-sm text-gray-500 text-center">
                Mulai kelola keuanganmu secara cerdas dengan Wallee
              </p>
            </div>
            
            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nama Lengkap
                </label>
                <InputFields
                      type="text"
                      placeholder="Masukkan nama lengkap Anda"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="px-3.5 py-2.5"
                      required
                    />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Alamat Email
                </label>
                <InputFields
                  type="email"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="px-3.5 py-2.5"
                  required
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <InputFields
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="px-3.5 py-2.5 text-black"
                  required
                />
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <ButtonGrad
                type="submit"
                disabled={loading}
                className="
                 w-full h-11 rounded-[10px] flex items-center justify-center gap-2
                 bg-gradient-to-r from-[#3975E6] to-[#9E4CC6]
                 text-white text-sm font-semibold
                 shadow-[0_4px_14px_rgba(57,117,230,0.3)]
                 hover:shadow-[0_8px_24px_rgba(57,117,230,0.4)] hover:-translate-y-0.5 active:scale-[.98]
                 disabled:opacity-60 disabled:cursor-not-allowed
                 transition-all duration-300 mt-6
                "
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Membuat akun...
                  </>
                ) : (
                  <>
                    Buat Akun Gratis
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </>
                )}
              </ButtonGrad>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:opacity-75 transition-opacity">
                Masuk di sini →
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}