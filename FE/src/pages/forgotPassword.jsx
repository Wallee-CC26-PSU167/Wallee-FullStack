import { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import WalleeLogo from "../assets/Logo_Full.png";
import { forgotPasswordAPI } from "../services/auth_service";

export default function ForgotPassword() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiErr, setApiErr] = useState("");

  function validate() {
    if (!email) return "Email tidak boleh kosong";
    if (!/\S+@\S+\.\S+/.test(email)) return "Format email tidak valid";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    setError(err);
    if (err) return;

    setLoading(true);
    setApiErr("");
    setSuccess(false);

    try {
      await forgotPasswordAPI(email);
      setSuccess(true);
    } catch (err) {
      setApiErr(err.response?.data?.message ?? "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 
    "w-full px-3.5 py-2.5 rounded-[10px] border bg-white text-sm outline-none transition-all duration-300 placeholder:text-gray-400 hover:border-blue-400 hover:shadow-[0_2px_8px_rgba(57,117,230,0.1)] " +
    (error
      ? "border-red-400 ring-4 ring-red-500/10"
      : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15");

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center p-4 sm:p-6">
      <div 
        data-aos="zoom-in" data-aos-duration="600"
        className="w-full max-w-[480px] bg-white rounded-2xl overflow-hidden shadow-[0_8px_48px_rgba(15,24,41,0.12)] hover:shadow-[0_16px_60px_rgba(15,24,41,0.2)] transition-shadow duration-500 flex flex-col p-8 sm:p-12"
      >
        <div className="flex justify-center mb-6">
          <img src={WalleeLogo} alt="Wallee Logo" className="h-14 w-auto hover:scale-105 hover:drop-shadow-md transition-all duration-300" />
        </div>
        
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Lupa Password?
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Masukkan email yang terdaftar untuk menerima link reset password.
          </p>
        </div>

        {success ? (
          <div className="text-center p-5 bg-green-50 border border-green-200 rounded-xl mb-6">
            <Mail className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="text-green-800 font-bold mb-1">Cek Email Kamu</h3>
            <p className="text-sm text-green-600">
              Link untuk mereset password telah dikirim ke <b>{email}</b>. Link tersebut berlaku selama 15 menit.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Alamat Email
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setApiErr("");
                }}
                className={inputClass}
              />
              {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
              {apiErr && <p className="mt-1.5 text-xs text-red-500">{apiErr}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full h-11 rounded-[10px] flex items-center justify-center gap-2
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
                  Mengirim...
                </>
              ) : (
                <>
                  Kirim Link Reset
                  <ArrowRight size={15} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-100 pt-6">
          Ingat password kamu?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:opacity-75 transition-opacity">
            Masuk di sini →
          </Link>
        </div>

      </div>
    </div>
  );
}
