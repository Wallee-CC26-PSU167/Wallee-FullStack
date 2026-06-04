# 💰 Wallee — Aplikasi Manajemen Keuangan Pribadi

Wallee adalah aplikasi web manajemen keuangan pribadi yang dilengkapi fitur AI untuk deteksi anomali transaksi dan prediksi pengeluaran

---

## ✨ Fitur Utama

- **Autentikasi** — Register, Login, Lupa Password, Reset Password
- **Dashboard** — Ringkasan saldo, pemasukan & pengeluaran, notifikasi anomali, bell dropdown notifikasi
- **Transaksi** — CRUD transaksi (pemasukan & pengeluaran), search, filter kategori & tipe, detail anomali per transaksi
- **Tambah Transaksi** — Form pemasukan (amount + kategori) dan pengeluaran (multi-item dengan nama, qty, harga, kategori)
- **Analitik** — Chart pengeluaran bulan ini / bulan lalu
- **Pengaturan** — Ubah username, email, dan password
- **AI Anomaly Detection** — Deteksi otomatis transaksi mencurigakan dari transaksi kemarin
- **AI Forecasting** — Prediksi pengeluaran berdasarkan histori transaksi

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router v7, Recharts, Axios, Sonner |
| Backend | Node.js, Express 5, PostgreSQL, Redis (ioredis) |
| Auth | JWT (jsonwebtoken), bcrypt |
| Validasi | Joi |
| Migrasi DB | node-pg-migrate |
| AI Services | External REST API (Anomaly & Forecast) |

---

## ⚙️ Cara Menjalankan

### Prasyarat

- Node.js >= 18
- PostgreSQL
- Redis

---

### 1. Backend

```bash
cd BE
npm install
```

Buat file `.env` di folder `BE/`:

```env
DATABASE_URL=postgresql://user:password@host/dbname
PGUSER=postgres
PGHOST=localhost
PGPASSWORD=yourpassword
PGDATABASE=wallee_fiks
PGPORT=5432

PORT=3000
JWT_SECRET=your_jwt_secret

REDIS_URL=redis://localhost:6379

AI_ANOMALY_URL=https://your-anomaly-ai-endpoint/predict/batch
AI_FORECAST_URL=https://your-forecast-ai-endpoint/predict
```

Jalankan migrasi database:

```bash
npm run migrate
```

(Opsional) Seed data awal:

```bash
npm run seed
```

Jalankan server:

```bash
# Development
npm run dev

# Production
npm start
```

Server berjalan di `http://localhost:3000`

---

### 2. Frontend

```bash
cd FE
npm install
```

Buat file `.env` di folder `FE/`:

```env
VITE_API_URL=http://localhost:3000/api
```

> Atau sesuaikan `baseURL` di `src/services/api.js`.

Jalankan app:

```bash
# Development
npm run dev

# Build production
npm run build
```

App berjalan di `http://localhost:5173`

---

## 📡 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/register` | Daftar akun baru |
| POST | `/login` | Login |
| POST | `/forgot-password` | Kirim email reset password |
| POST | `/reset-password` | Reset password dengan token |

### Profile — `/api/profile` *(Auth required)*
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/` | Ambil profil user |
| PUT | `/` | Update profil (nama, email) |

### Transaksi — `/api/transactions` *(Auth required)*
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/` | List transaksi (support: page, limit, startDate, endDate) |
| GET | `/:id` | Detail transaksi |
| GET | `/summary` | Ringkasan (month, year) |
| GET | `/analytics` | Data analitik untuk chart |
| POST | `/` | Buat transaksi baru |
| DELETE | `/:id` | Hapus transaksi |

### Kategori — `/api/categories` *(Auth required)*
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/` | List semua kategori |

### Notifikasi Anomali — `/api/ai/notifications` *(Auth required)*
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/` | Ambil semua notifikasi anomali |
| POST | `/` | Simpan hasil deteksi anomali dari AI |
| PATCH | `/dismiss/:itemId` | Dismiss satu item notifikasi |

### Forecast — `/api/ai/forecast` *(Auth required)*
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/` | Prediksi pengeluaran |

---

## 🗄️ Struktur Database

| Tabel | Deskripsi |
|---|---|
| `users` | Data akun pengguna |
| `kategori` | Kategori transaksi |
| `transaksi` | Data transaksi utama |
| `item_transaksi` | Item detail per transaksi pengeluaran |
| `notifications` | Header notifikasi anomali |
| `notification_items` | Detail tiap anomali per notifikasi |

---

## 📁 Struktur Folder

```
BE/
├── src/
│   ├── app.js              # Entry point Express
│   ├── config/             # Konfigurasi DB & Redis
│   ├── routes/             # Definisi route
│   ├── controller/         # Handler request
│   ├── service/            # Business logic
│   ├── repositories/       # Query database
│   ├── middleware/         # Auth & validasi middleware
│   ├── validation/         # Schema validasi Joi
│   ├── adapter/            # Adapter response AI
│   ├── helper/             # Helper fungsi
│   └── utils/              # Utility (cache, dll)
├── migrations/             # File migrasi database
└── seed/                   # Data seed

FE/
├── src/
│   ├── pages/              # Halaman aplikasi
│   ├── components/         # Komponen UI & Layout
│   ├── services/           # Fungsi pemanggilan API
│   ├── context/            # React Context (Auth)
│   └── routes/             # Konfigurasi routing
├── public/                 # Asset publik
└── index.html
```

---

## 🚀 Deployment

- **Backend**: Dapat di-deploy ke Railway, Render, atau VPS. Pastikan environment variable sudah diset.
- **Frontend**: Dapat di-deploy ke Vercel (sudah tersedia `vercel.json`). Set `VITE_API_URL` ke URL backend production.

---

## 📝 Catatan

- Deteksi anomali berjalan otomatis saat user pertama kali membuka halaman notifikasi setiap hari (berdasarkan transaksi kemarin).
- Forecasting membutuhkan minimal **3 transaksi** dalam histori untuk menghasilkan prediksi.
- Cache Redis digunakan untuk transaksi, summary, analitik, dan notifikasi guna meningkatkan performa.
