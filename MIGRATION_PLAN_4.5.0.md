# Rencana Migrasi Karang Taruna App v3.0.0 ke v4.5.0

## 1. Struktur Folder Versi Baru (v4.5.0)

Dengan implementasi modular arsitektur, struktur proyek akan menjadi seperti ini:

```
karang-taruna-app/
├── src/
│   ├── components/
│   │   ├── charts/         <-- Baru: Chart komponen untuk statistik
│   │   ├── layout/         <-- Notifikasi bell
│   │   ├── auth/           <-- RBAC Guard
│   │   └── ...
│   ├── config/             <-- Firebase & Cloudinary
│   ├── context/            <-- AuthContext
│   ├── hooks/              <-- Baru: Reusable hooks (e.g. useFirestore, usePermissions)
│   ├── modules/            <-- Baru: Modular Domain Logic
│   │   ├── members/
│   │   ├── finance/
│   │   ├── activities/
│   │   ├── attendance/     <-- Baru: QR Attendance System
│   │   ├── subscriptions/  <-- Baru: Iuran Anggota
│   │   └── announcements/
│   ├── pages/
│   │   ├── reports/        <-- Baru: Halaman Modul Laporan
│   │   ├── subscriptions/  <-- Baru: Halaman Iuran
│   │   ├── attendance/     <-- Baru: Halaman Absensi QR
│   │   └── ...             <-- Legacy pages
│   ├── services/           <-- Baru: API calls & external services
│   ├── utils/
│   ├── App.jsx             <-- Routing & Lazy Loading
│   └── main.jsx
```

## 2. Daftar File Baru yang Perlu Dibuat

1. **Dashboard Statistik:**
   - `src/components/charts/FinanceChart.jsx`
   - `src/components/charts/ActivityChart.jsx`
   - `src/components/charts/MemberChart.jsx`
2. **Sistem Iuran Anggota:**
   - `src/pages/subscriptions/Subscriptions.jsx`
   - `src/modules/subscriptions/subscriptionService.js`
3. **QR Attendance Kegiatan:**
   - `src/pages/attendance/QRScan.jsx`
   - `src/pages/attendance/QRGenerate.jsx` (atau integrasi di ActivityDetail)
4. **Modul Laporan:**
   - `src/pages/reports/Reports.jsx`
5. **Sistem Notifikasi:**
   - `src/components/layout/NotificationsBell.jsx`
6. **Reusable Hooks & Services (Optimasi):**
   - `src/hooks/useFirestore.js`
   - `src/services/exportService.js`

## 3. Perubahan Kode Utama

- **package.json:**
  - Update `"version": "4.5.0"`.
  - Tambah dependensi `recharts` atau `chart.js` untuk grafik (`npm install recharts`).
  - Tambah dependensi `html5-qrcode` atau `react-qr-code` untuk fitur QR.
- **App.jsx:**
  - Daftarkan route baru (`/reports`, `/subscriptions`, `/attendance/scan`).
  - Implementasikan fungsi lazy loading (`React.lazy`) untuk semua rute baru demi optimasi performa.
- **Dashboard.jsx:**
  - Integrasikan komponen grafik (`FinanceChart`, `ActivityChart`) untuk menggantikan summary teks biasa.
  - Pasang komponen `NotificationsBell` di bagian header/navbar atas.
- **Firebase Auth & RBAC Guard:**
  - Pastikan halaman laporan (`/reports`) hanya bisa diakses oleh `super_admin`, `ketua`, `sekretaris`, dan `bendahara`.
  - Halaman `QRScan` bisa diakses oleh semua anggota terverifikasi.

## 4. Contoh Implementasi Fitur Baru

### A. Komponen Grafik Keuangan (Recharts)
Sudah diimplementasikan pada file `src/components/charts/FinanceChart.jsx`.
```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// ... penggunaan BarChart untuk kas bulanan
```

### B. Notifikasi In-App
Sudah diimplementasikan pada file `src/components/layout/NotificationsBell.jsx`. Menggunakan snapshot real-time Firestore untuk menampilkan pengumuman terbaru.

### C. Sistem QR Absensi
Contoh file placeholder dibuat pada `src/pages/attendance/QRScan.jsx` yang memanfaatkan Firestore untuk menyimpan dokumen kehadiran:
```jsx
const attendanceRef = doc(db, 'attendance', `${activityId}_${userId}`);
await setDoc(attendanceRef, { ... });
```

## 5. Best Practice untuk Firebase di v4.5.0

1. **Firestore Security Rules:**
   - Karena modul baru (Iuran dan Kehadiran) ditambahkan, rules harus diperbarui.
   - **Iuran (`subscriptions`)**: Read untuk user yang bersangkutan dan admin, Write hanya untuk admin (bendahara, ketua).
   - **Kehadiran (`attendance`)**: Create diperbolehkan untuk authenticated user yang menyertakan UID mereka, Update/Delete hanya untuk panitia (admin).
   - *Contoh Rule:*
     ```javascript
     match /attendance/{docId} {
       allow create: if request.auth != null && request.auth.uid == request.resource.data.memberId;
       allow read, update, delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'ketua'];
     }
     ```
2. **Optimasi Query & Pembacaan Data:**
   - Gunakan `limit()` dan `orderBy()` secara efisien pada stream notifikasi.
   - Hindari fetch koleksi besar secara keseluruhan. Pada halaman `Reports`, pertimbangkan menggunakan Firebase Cloud Functions atau batch reading yang dibatasi rentang tanggal untuk mencegah spike pada kuota Firebase baca (read usage).
3. **Lazy Loading Modul:**
   - Lakukan load `firebase/firestore` dan `firebase/storage` secara bertahap dalam *reusable hooks* bila mungkin, untuk mempercepat Time-To-Interactive (TTI) saat login.

## 6. Migration Plan dari 3.0.0 ke 4.5.0

1. **Tahap 1: Setup & Dependencies (Selesai)**
   - Update `package.json` dan instalasi `recharts` / QR libraries.
   - Buat struktur folder arsitektur modular baru (`src/modules`, `src/hooks`, `src/services`).
2. **Tahap 2: UI & Tampilan Baru**
   - Buat halaman UI untuk Reports, Subscriptions, dan Attendance Scan.
   - Buat file Chart untuk Dashboard.
3. **Tahap 3: Logic Firestore & Integrasi State**
   - Sambungkan halaman-halaman tersebut dengan Firestore menggunakan rules yang baru.
   - Integrasikan `exportToCSV` pada modul Laporan.
4. **Tahap 4: Testing & RBAC Verification**
   - Uji akses route `/reports` dan pastikan anggota biasa terlempar ke Dashboard/Unauthorized.
   - Uji fitur scan QR dan input data `attendance`.
5. **Tahap 5: Deployment**
   - Build project dengan Vite (`npm run build`).
   - Deploy ke hosting pilihan (contoh: Vercel) dan update aturan Firebase Rules.
