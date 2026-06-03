import { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowRight, CheckCircle, ArrowLeft } from "lucide-react";
import WalleeLogo from "../assets/Logo_Full.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    // Token dan id check dihilangkan untuk keperluan frontend-only
    // if (!token || !id) {
    //   navigate("/login");
    // }
  }, [token, id, navigate]);

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiErr, setApiErr] = useState("");

  function set(field) {
    return (e) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: "" }));
      setApiErr("");
    };
  }

  function validate() {
    const e = {};
    if (!form.password) e.password = "Password tidak boleh kosong";
    else if (form.password.length < 6) e.password = "Minimal 6 karakter";
    
    if (!form.confirmPassword) e.confirmPassword = "Konfirmasi password tidak boleh kosong";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Password tidak sama";
    
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setApiErr("");

    // Simulate an API call with a short timeout since it's frontend-only
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  }

  const inputClass = (field) => [
    "w-full px-3.5 py-2.5 rounded-[10px] border bg-white text-sm outline-none transition-all duration-300 placeholder:text-gray-400 hover:border-blue-400 hover:shadow-[0_2px_8px_rgba(57,117,230,0.1)]",
    errors[field]
      ? "border-red-400 ring-4 ring-red-500/10"
      : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15",
  ].join(" ");

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center p-4 sm:p-6 relative">
      {/* Tombol Kembali ke Landing Page */}
      <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all duration-300 font-medium bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md hover:-translate-x-1 z-50">
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">Kembali ke Beranda</span>
      </Link>
      <div 
        data-aos="zoom-in" data-aos-duration="600"
        className="w-full max-w-[480px] bg-white rounded-2xl overflow-hidden shadow-[0_8px_48px_rgba(15,24,41,0.12)] hover:shadow-[0_16px_60px_rgba(15,24,41,0.2)] transition-shadow duration-500 flex flex-col p-8 sm:p-12"
      >
        <div className="flex justify-center mb-6">
          <Link to="/" title="Kembali ke Beranda">
            <img src={WalleeLogo} alt="Wallee Logo" className="h-14 w-auto hover:scale-105 hover:drop-shadow-md transition-all duration-300" />
          </Link>
        </div>
        
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Buat Password Baru
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Masukkan password baru kamu untuk akun Wallee.
          </p>
        </div>

        {success ? (
          <div className="text-center p-5 bg-green-50 border border-green-200 rounded-xl mb-6">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="text-green-800 font-bold mb-1">Password Berhasil Diubah!</h3>
            <p className="text-sm text-green-600 mb-4">
              Password kamu telah diperbarui. Silakan login menggunakan password baru kamu.
            </p>
            <Link to="/login" className="inline-block px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Ke Halaman Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {apiErr && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 text-center">
                {apiErr}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password Baru
              </label>
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={form.password}
                onChange={set("password")}
                className={inputClass("password")}
              />
              {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                placeholder="Ketik ulang password"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                className={inputClass("confirmPassword")}
              />
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full h-11 mt-2 rounded-[10px] flex items-center justify-center gap-2
                bg-gradient-to-r from-[#3975E6] to-[#9E4CC6]
                text-white text-sm font-semibold
                shadow-[0_4px_14px_rgba(57,117,230,0.3)]
                hover:shadow-[0_8px_24px_rgba(57,117,230,0.4)] hover:-translate-y-0.5 active:scale-[.98]
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-300
              "
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  Simpan Password Baru
                  <ArrowRight size={15} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
