# Arsitektur & Migrasi Karang Taruna Management System v4.5.0

Dokumen ini merinci pendekatan _Clean Architecture_ dan _Scalable Modular Structure_ untuk meng-upgrade aplikasi dari versi 3.0.0 ke 4.5.0 sesuai dengan kebutuhan fitur baru.

---

## 1. Struktur Folder Versi Baru (Modular Architecture)

Sistem lama yang berpusat pada folder `pages/` dan `components/` akan dipecah berdasarkan domain bisnis (modul) agar kode lebih terisolasi, mudah dipelihara, dan skalabel.

```text
src/
├── components/          # Shared/Global UI (Button, Modal, Skeletons, Layouts)
├── config/              # Firebase initialization & Env
├── context/             # AuthContext, Global state
├── hooks/               # Global reusable hooks (e.g., useWindowSize, useToast)
├── services/            # Global API services & wrappers
├── utils/               # Formatters (currency, date, csv export)
└── modules/             # [NEW] DOMAIN LOGIC
    ├── members/         # Manajemen Anggota & Profil
    ├── finance/         # Keuangan & Transaksi Kas
    ├── activities/      # Manajemen Kegiatan & Galeri
    ├── attendance/      # Sistem QR Absensi
    ├── subscriptions/   # Sistem Iuran Bulanan Anggota
    ├── announcements/   # Pengumuman Organisasi
    └── reports/         # Dashboard Statistik & Modul Ekspor Laporan
```

**Isi setiap folder modul (contoh: `subscriptions`):**
```text
modules/subscriptions/
├── components/          # e.g., SubscriptionCard, PaymentStatusBadge
├── pages/               # e.g., SubscriptionsList.jsx, SubscriptionDetail.jsx
├── services/            # e.g., subscriptionService.js (Firestore logic)
└── hooks/               # e.g., useSubscriptions.js (Data fetching)
```

---

## 2. Daftar File Baru yang Perlu Dibuat

1. **Modul Laporan & Statistik:**
   - `src/modules/reports/pages/Reports.jsx`
   - `src/modules/reports/components/FinanceChart.jsx` (Recharts)
   - `src/modules/reports/components/ActivityChart.jsx`
   - `src/modules/reports/components/MemberStatCard.jsx`
2. **Modul Absensi QR:**
   - `src/modules/attendance/pages/QRScan.jsx` (React QR Reader)
   - `src/modules/attendance/pages/QRGenerate.jsx` (QRCode)
   - `src/modules/attendance/services/attendanceService.js`
3. **Modul Iuran (Subscriptions):**
   - `src/modules/subscriptions/pages/SubscriptionList.jsx`
   - `src/modules/subscriptions/services/subscriptionService.js`
4. **Sistem Notifikasi In-App:**
   - `src/components/layout/NotificationsBell.jsx`
5. **Shared Hooks & Utilities:**
   - `src/hooks/useFirestoreQuery.js`
   - `src/utils/date.js` (Memanfaatkan `date-fns` untuk manipulasi tanggal kompleks)

---

## 3. Perubahan pada App.jsx Routing

`App.jsx` diperbarui menggunakan **React.lazy** dan **Suspense** untuk _code splitting_. Setiap rute memuat halaman secara mandiri, sehingga bundle awal jauh lebih kecil.

```jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';

// === LAZY LOADING MODULES ===
// Dashboard & Reports
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Reports = lazy(() => import('./modules/reports/pages/Reports'));

// Attendance & Subscriptions
const QRScan = lazy(() => import('./modules/attendance/pages/QRScan'));
const SubscriptionList = lazy(() => import('./modules/subscriptions/pages/SubscriptionList'));

// Loading Fallback
const LoadingScreen = () => <div className="spinner">Loading...</div>;

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
           <Route path="/dashboard" element={<Dashboard />} />

           {/* Modul Kehadiran (Anggota) */}
           <Route path="/attendance/scan" element={<QRScan />} />

           {/* Modul Laporan & Iuran (Admin/Pengurus Khusus) */}
           <Route element={<ProtectedRoute allowedRoles={['super_admin', 'ketua', 'bendahara']} />}>
              <Route path="/reports" element={<Reports />} />
              <Route path="/subscriptions" element={<SubscriptionList />} />
           </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
export default App;
```

---

## 4. Contoh Implementasi Fitur Baru

### A. Reusable Hook (Performance Improvement)
Contoh _custom hook_ untuk _data fetching_ dengan *lazy initialization* dan pembersihan _listener_:

```javascript
// src/hooks/useFirestoreQuery.js
import { useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';

export function useFirestoreQuery(queryRef) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!queryRef) return;

    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    // Clean up listener on unmount
    return () => unsubscribe();
  }, [queryRef]);

  return { data, loading, error };
}
```

### B. Notifikasi Dalam Aplikasi (In-App)
Menggunakan `NotificationsBell` di header yang mendengarkan koleksi gabungan (atau disederhanakan melalui query pengumuman dan transaksi terbaru).

---

## 5. Struktur Database Firestore Baru

Untuk mendukung fitur kehadiran dan iuran, _schema_ baru ditambahkan dengan memperhatikan efisiensi query.

### Collection: `attendance`
Menyimpan riwayat kehadiran setiap anggota per kegiatan.
```json
{
  "__collection__": "attendance",
  "document_id": "user123_activity456", // Gabungan UID + ActivityID mencegah duplikat
  "userId": "user123",
  "activityId": "activity456",
  "timestamp": "2023-10-25T14:30:00Z", // Firestore Timestamp
  "status": "hadir",                   // 'hadir' | 'terlambat'
  "scannedBy": "admin789"              // (Opsional) UID admin yang scan jika tidak self-scan
}
```

### Collection: `subscriptions`
Menyimpan data tagihan dan pembayaran iuran bulanan.
```json
{
  "__collection__": "subscriptions",
  "document_id": "sub_987654",
  "userId": "user123",
  "month": 10,
  "year": 2023,
  "amount": 25000,
  "status": "paid",                    // 'paid' | 'unpaid'
  "paidAt": "2023-10-05T09:00:00Z"     // null jika 'unpaid'
}
```

---

## 6. Migration Plan (v3.0.0 → v4.5.0)

Pendekatan migrasi dilakukan secara bertahap (agile) agar tidak merusak sistem yang sedang berjalan:

**Fase 1: Persiapan Arsitektur & Performa (Minggu 1)**
- *Task:* Buat struktur folder `modules/`. Pindahkan logika data fetching ke dalam _custom hooks_ di folder `src/hooks/`.
- *Task:* Implementasikan `React.lazy()` pada `App.jsx` untuk _code splitting_.
- *Task:* Tambahkan library `recharts`, `qrcode`, dan `date-fns` ke `package.json`.

**Fase 2: Pembuatan Modul Baru (Minggu 2-3)**
- *Task:* Kembangkan modul `attendance` (UI generator QR dan Scanner QR).
- *Task:* Kembangkan modul `subscriptions` (Tabel iuran bulanan, status warna hijau/merah).
- *Task:* Integrasi Firestore security rules khusus untuk koleksi baru.

**Fase 3: Dashboard & Pelaporan (Minggu 4)**
- *Task:* Buat halaman `Reports.jsx` dan komponen Chart (Kas & Anggota) di Dashboard.
- *Task:* Tulis logika export CSV yang mengkonsolidasikan data dari berbagai koleksi.

**Fase 4: Testing & Deployment (Minggu 5)**
- *Task:* Uji coba keamanan RBAC pada route baru.
- *Task:* Pantau _bundle size_ dan waktu load dengan Vite analyzer.
- *Task:* Deploy ke Production (v4.5.0).

---

## 7. Best Practice React + Firebase (Security & Clean Code)

1. **Backend Validation via Firestore Rules (Wajib!):**
   *Jangan pernah mempercayai klien.* Meskipun React Router membatasi akses (RBAC di UI), *Security Rules* harus di-update agar hanya *Role* yang sesuai yang bisa mengubah data.
   ```javascript
   // firestore.rules
   match /subscriptions/{subId} {
     // Hanya anggota yang bisa melihat iurannya sendiri, admin bisa semua
     allow read: if request.auth.uid == resource.data.userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['ketua', 'bendahara'];
     allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['ketua', 'bendahara'];
   }
   ```
2. **Hindari N+1 Queries:**
   - Pada modul pelaporan, alih-alih melakukan loop query per anggota, ambil batch dokumen berdasarkan limit rentang waktu (tanggal awal & akhir), lalu lakukan komputasi gabungan di sisi klien jika jumlahnya di bawah batas kuota baca wajar, atau gunakan _Firebase Cloud Functions_ untuk komputasi berat.
3. **Pemisahan Presentational & Container Components:**
   - Pisahkan logika fetch data (di dalam hooks atau komponen *container*) dari UI rendering (komponen *presentational* statis). Ini memudahkan testing dan reusability. (Mendukung _Clean Architecture_).
4. **Environment Variables:**
   - Amankan konfig Firebase menggunakan `.env.local` dengan prefix `VITE_`.
