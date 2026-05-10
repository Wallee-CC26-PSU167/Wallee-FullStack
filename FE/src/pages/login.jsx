// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Wallet } from "lucide-react";

export default function Login() {
  const navigate  = useNavigate();

  const [form,    setForm]    = useState({ email: "", password: "" });
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

  const handleLogin = async () => {
  navigate("/dashboard");
};

  function validate() {
    const e = {};
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
      await handleLogin(form);
    } catch (err) {
      setApiErr(err.message ?? "Login gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">

      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-modal p-8">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-brand">
            <Wallet size={17} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold gradient-text">Wallee</span>
        </div>

        {/* Heading */}
        <div className="mb-7">
          <h1 className="font-display text-2xl font-bold text-text-primary mb-1.5">
            Selamat datang kembali 👋
          </h1>
          <p className="text-base text-text-sub">
            Masuk untuk melihat ringkasan keuanganmu.
          </p>
        </div>

        {/* Google OAuth */}
        <button className="
          w-full flex items-center justify-center gap-2.5
          h-11 rounded-[10px] border border-border bg-white
          text-base font-medium text-text-primary
          hover:bg-surface hover:border-gray-300
          transition-all shadow-xs mb-5
        ">
          <svg width="16" height="16" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
          </svg>
          Lanjutkan dengan Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-muted whitespace-nowrap">atau dengan email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* API Error */}
        {apiErr && (
          <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {apiErr}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Alamat Email
            </label>
            <input
              type="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={set("email")}
              autoComplete="email"
              className={[
                "w-full px-3.5 py-2.5 rounded-[10px] border bg-white text-sm outline-none transition-all",
                errors.email
                  ? "border-red-400 ring-4 ring-red-500/10"
                  : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
              ].join(" ")}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-blue-600 font-medium hover:opacity-75 transition-opacity">
                Lupa password?
              </Link>
            </div>
            <input
              type="password"
              placeholder="Masukkan password"
              value={form.password}
              onChange={set("password")}
              autoComplete="current-password"
              className={[
                "w-full px-3.5 py-2.5 rounded-[10px] border bg-white text-sm outline-none transition-all",
                errors.password
                  ? "border-red-400 ring-4 ring-red-500/10"
                  : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
              ].join(" ")}
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full h-11 rounded-[10px] flex items-center justify-center gap-2
              bg-gradient-to-r from-[#3975E6] to-[#9E4CC6]
              text-white text-sm font-semibold
              shadow-[0_4px_14px_rgba(57,117,230,0.3)]
              hover:opacity-90 active:scale-[.98]
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all
            "
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Memverifikasi...
              </>
            ) : (
              <>
                Masuk ke Wallee
                <ArrowRight size={15} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        {/* Register link */}
        <p className="mt-5 text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:opacity-75 transition-opacity">
            Daftar gratis →
          </Link>
        </p>

        {/* Trust badges */}
        <div className="mt-7 pt-5 border-t border-gray-100 flex items-center justify-center gap-5">
          {[["🔒","SSL Encrypted"],["🛡","GDPR Safe"],["🏦","Bank-level"]].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-1">
              <span className="text-sm">{icon}</span>
              <span className="text-xs text-gray-400 font-medium">{label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}