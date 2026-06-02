// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Wallet } from "lucide-react";
import WalleeLogo from "../assets/Logo_Full.png";
import Card from "../components/ui/card";
import ButtonGrad from "../components/ui/buttongrad";
import InputFields from "../components/ui/input";
import { registerUser } from "../services/auth_service";

export default function Register() {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center p-4">

      <Card className="p-6 md:p-8 shadow-md">

        <div className="flex justify-center mb-4">
            <img src={WalleeLogo} alt="Wallee Logo" className="h-15 w-auto" />
        </div>

        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900 mb-1.5">
            Buat akun baru ✨
          </h1>
          <p className="text-sm text-gray-500">
            Mulai kelola keuanganmu secara cerdas dengan Wallee.
          </p>
        </div>

        <button className="
          w-full flex items-center justify-center gap-2.5
          h-11 rounded-[10px] border border-gray-200 bg-white
          text-sm font-medium text-gray-700
          hover:bg-gray-50 hover:border-gray-300
          transition-all shadow-[0_1px_3px_rgba(15,24,41,0.06)] mb-5
        ">
          <svg width="16" height="16" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
          </svg>
          Daftar dengan Google
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 whitespace-nowrap">atau dengan email</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {apiErr && (
          <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {apiErr}
          </div>
        )}

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
             w-full h-13 rounded-xl font-bold mt-2
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

      </Card>
    </div>
  );
}