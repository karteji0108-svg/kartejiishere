# Dokumen Teknis Upgrade Sistem: Karang Taruna Management System (v3.0.0 → v4.5.0)

Dokumen ini merinci strategi komprehensif untuk melakukan *upgrade* sistem secara aman, stabil, dan tanpa mengganggu operasional sistem yang sudah berjalan (Zero-Downtime Migration approach).

---

## 1. Checklist Sebelum Upgrade (Pre-flight Checks)

Sebelum baris kode apa pun diubah di *production*, pastikan langkah berikut diselesaikan:

- [ ] **Backup Database Firestore:** Lakukan eksport data Firestore v3.0.0 ke Google Cloud Storage (GCS) menggunakan *Firebase Console* atau *gcloud CLI*.
- [ ] **Backup Storage:** Lakukan sinkronisasi/backup *Firebase Storage* dan catat snapshot *Cloudinary*.
- [ ] **Backup Project (Version Control):** Buat *branch* khusus untuk *release* v3.0.0 (`git checkout -b release/v3.0.0`) sebagai *restore point* pasti.
- [ ] **Dependency Audit:** Jalankan `npm audit` dan update versi package non-breaking jika ada celah keamanan. Instal dependensi baru (`recharts`, `qrcode`, `react-qr-reader`, `date-fns`).
- [ ] **Setup Staging Environment:** Siapkan Firebase Project terpisah (misal: `karang-taruna-staging`) yang meniru environment *production*.

---

## 2. Migration Plan (Refactor Struktur & Kode)

Tujuan utama adalah memecah struktur `pages/` monolithic menjadi *Modular Architecture*.

### A. Langkah Refactoring Folder
1. Buat folder `src/modules/` beserta sub-folder domain bisnis (`members`, `finance`, `activities`, `attendance`, `subscriptions`, `announcements`, `reports`).
2. Pindahkan komponen spesifik dari `src/components/` dan `src/pages/` ke dalam folder `components` dan `pages` di masing-masing modul.
   - *Penting:* Jangan ubah nama *file* atau fungsionalitas di tahap ini; cukup perbaiki *relative paths* (`import ... from '../../...'`).
3. Buat folder `src/hooks/` dan `src/services/` untuk memisahkan *business logic* (Firebase calls) dari komponen UI (React).

### B. Update Routing (`App.jsx`)
Ubah routing statis menjadi asinkron dengan Code Splitting.
```jsx
// src/App.jsx
import React, { Suspense, lazy } from 'react';

// Modul Lama (Contoh)
const Finance = lazy(() => import('./modules/finance/pages/Finance'));
// Modul Baru (Contoh)
const Reports = lazy(() => import('./modules/reports/pages/Reports'));

// Fallback skeleton
const PageLoading = () => <div className="spinner">Memuat...</div>;

// Implementasi di Routes
<Route path="/finance" element={
  <Suspense fallback={<PageLoading />}>
    <Finance />
  </Suspense>
} />
```

---

## 3. Update Database Firestore (Non-Destructive)

Data eksisting (`users`, `finance`, `activities`) tidak akan dimutasi. Modul baru hanya akan membuat *Collection* baru.

### A. Collection: `attendance`
Menyimpan data *scan* QR.
- `userId` (String): Refensi ke user UID
- `activityId` (String): Referensi ke kegiatan
- `timestamp` (Timestamp): Waktu presensi
- `status` (String): 'hadir'

### B. Collection: `subscriptions`
Menyimpan tagihan iuran.
- `userId` (String): Referensi ke user UID
- `month` (Number): Bulan iuran (1-12)
- `year` (Number): Tahun iuran
- `amount` (Number): Nominal
- `status` (String): 'paid' / 'unpaid'
- `paidAt` (Timestamp / Null): Waktu pelunasan

---

## 4. Update Firestore Security Rules (RBAC)

Pastikan modul lama tetap terkunci seperti biasa, lalu tambahkan *rules* baru untuk `attendance` dan `subscriptions`.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Fungsi bantuan RBAC Backend
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    function isAdmin() {
      return getUserRole() in ['super_admin', 'ketua', 'bendahara', 'sekretaris'];
    }

    // Rules eksisting dibiarkan...

    // RULES BARU v4.5.0
    match /attendance/{docId} {
      // User hanya bisa buat absensi dirinya sendiri; Admin bisa akses semua
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read: if request.auth.uid == resource.data.userId || isAdmin();
      allow update, delete: if isAdmin();
    }

    match /subscriptions/{docId} {
      // User bisa lihat iurannya; Hanya admin (bendahara) yang bisa mengubah status pembayaran
      allow read: if request.auth.uid == resource.data.userId || isAdmin();
      allow write: if isAdmin();
    }
  }
}
```

---

## 5. Performance Optimization

1. **Lazy Loading & Code Splitting:** Diimplementasikan di `App.jsx` menggunakan `React.lazy`. Ini mengurangi *initial bundle payload* sehingga waktu *First Contentful Paint (FCP)* lebih cepat.
2. **Reusable Data Fetching Hooks:** Pindahkan logika `onSnapshot` ke custom hooks (`useFirestoreQuery`). Gunakan *dependency array* yang tepat untuk mencegah *memory leaks* (pastikan mengembalikan fungsi `unsubscribe`).
3. **Optimasi Query Firestore:** Pada grafik dashboard (kas bulanan), jangan fetch seluruh transaksi *all-time*. Gunakan query `.where('date', '>=', startOfYear)` untuk membatasi *document read*.

---

## 6. Testing Plan (Quality Assurance)

### A. Modul yang Harus Diuji (Regression Testing)
- **Modul Autentikasi:** Login, Register, Logout (pastikan session tetap hidup).
- **Sistem RBAC Eksisting:** Uji coba *login* sebagai anggota biasa, pastikan tidak bisa masuk ke URL `/reports` atau mengubah role user lain.
- **Modul Keuangan Lama:** Pastikan saldo kas tetap terhitung dengan benar setelah struktur folder diubah.

### B. Skenario Testing (Fitur Baru)
- **Sistem Iuran:**
  1. (Bendahara) Generate tagihan bulan ini.
  2. (Anggota) Lihat tagihan (harus berstatus 'unpaid').
  3. (Bendahara) Tandai lunas.
  4. (Anggota) Lihat tagihan (harus berubah jadi 'paid' warna hijau).
- **QR Attendance:**
  1. (Admin) Generate QR untuk kegiatan X.
  2. (Anggota) Scan QR -> Sukses (data masuk Firestore).
  3. (Anggota) Scan ulang QR yang sama -> Ditolak/Diabaikan.
- **Laporan & Export:**
  1. Akses halaman `/reports` -> Unduh CSV -> Pastikan format koma terbaca rapi di Excel.

---

## 7. Deployment Plan

Gunakan strategi *Blue-Green Deployment* yang disederhanakan:

1. **Staging Deployment:**
   - Deploy *branch* v4.5.0 ke *Staging Environment* (misal: Firebase Hosting `karang-taruna-staging`).
   - Arahkan ke database *Staging*.
   - Minta pengurus inti (Ketua/Bendahara) melakukan *User Acceptance Testing (UAT)*.
2. **Production Deployment:**
   - Jadwalkan eksekusi saat *traffic* rendah (misal: tengah malam).
   - Jalankan `firebase deploy --only firestore:rules` untuk mengaplikasikan aturan keamanan baru *sebelum* UI baru naik.
   - Build aplikasi: `npm run build`.
   - Jalankan `firebase deploy --only hosting` (atau *push* ke cabang produksi Vercel/Netlify).
   - Lakukan validasi produksi cepat (Cek Login, Cek Dashboard Grafik).

---

## 8. Strategi Rollback (Disaster Recovery)

Jika ditemukan masalah fatal/blocker pada v4.5.0 di *Production*:

1. **Frontend Rollback:**
   - Langsung lakukan *revert deploy* pada Firebase Hosting console dengan meng-klik "Rollback" ke versi sebelum *deploy* v4.5.0, ATAU
   - Pindah ke *branch* `release/v3.0.0` lalu lakukan _re-deploy_.
2. **Backend/Rules Rollback:**
   - Lakukan *deploy* ulang file `firestore.rules` versi v3.0.0.
3. **Data Impact:**
   - Karena modul baru membuat *Collection* terpisah (`attendance`, `subscriptions`), tidak ada data lama yang rusak.
   - Jika *Rollback* dilakukan, data baru tersebut akan terabaikan oleh *frontend* v3.0.0, menjaga integritas sistem inti tetap aman 100%.
