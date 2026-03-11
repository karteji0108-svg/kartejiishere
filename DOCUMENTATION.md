# Dokumentasi Aplikasi Karang Taruna (v3.0.0)

Aplikasi Karang Taruna adalah platform berbasis web (PWA-ready) yang dirancang untuk membantu pengelolaan administrasi, keuangan, anggota, kegiatan, dan informasi dalam organisasi kepemudaan.

---

## 1. Struktur Folder

Aplikasi ini menggunakan framework React dengan Vite sebagai bundler. Berikut adalah struktur direktori utama:

```
karang-taruna-app/
├── public/                 # Aset statis yang tidak diproses oleh bundler (favicon, manifest PWA, logo)
├── src/                    # Source code utama aplikasi
│   ├── assets/             # Aset internal (gambar, ikon)
│   ├── components/         # Komponen UI yang dapat digunakan kembali
│   │   ├── auth/           # Komponen terkait autentikasi (ProtectedRoute, RoleGuard)
│   │   ├── common/         # Komponen umum (Skeleton, Modal, HeroCarousel)
│   │   ├── layout/         # Komponen tata letak (BottomNav, Sidebar)
│   │   └── ui/             # Komponen antarmuka dasar
│   ├── config/             # Konfigurasi aplikasi (Firebase)
│   ├── constants/          # Nilai konstanta statis (Role dan Permissions)
│   ├── context/            # React Context (AuthContext)
│   ├── pages/              # Komponen halaman (View tingkat atas)
│   ├── utils/              # Fungsi utilitas bantuan (format tanggal, mata uang, cloudinary)
│   ├── App.jsx             # Titik masuk routing utama
│   ├── index.css           # Global stylesheet dengan Tailwind directives
│   └── main.jsx            # Titik masuk utama aplikasi React
├── index.html              # Template HTML utama
├── tailwind.config.js      # Konfigurasi Tailwind CSS
├── vite.config.js          # Konfigurasi Vite
└── package.json            # Dependency dan script Node.js
```

## 2. Fungsi Tiap File (Komponen Utama)

### `src/App.jsx`
Routing utama aplikasi menggunakan `react-router-dom`. File ini mengatur hak akses halaman menggunakan `ProtectedRoute` berdasarkan status dan peran (role) pengguna.

### `src/context/AuthContext.jsx`
Mengelola *state* autentikasi global menggunakan Firebase Auth. Menyediakan data pengguna yang sedang login (`currentUser`), data profil dari Firestore (`userProfile`), peran (`userRole`), dan fungsi pembantu seperti `hasRole()`.

### `src/config/firebase.js`
Inisialisasi Firebase SDK (Auth, Firestore, Storage) menggunakan variabel lingkungan (environment variables) dari Vite.

### `src/constants/roles.js`
Mendefinisikan daftar peran pengguna (`super_admin`, `ketua`, `sekretaris`, `bendahara`, `anggota`, dll.) dan pemetaan hak akses (Permissions) untuk masing-masing peran.

### File di `src/pages/`
- **`Login.jsx` & `Register.jsx`**: Halaman untuk masuk dan mendaftar akun baru.
- **`Dashboard.jsx`**: Beranda utama setelah login. Menampilkan ringkasan metrik (jumlah anggota, kegiatan, kas), carousel hero, kegiatan terbaru, galeri terbaru, dan pengumuman.
- **`MemberList.jsx` & `MemberDetail.jsx`**: Halaman direktori anggota organisasi dan detail spesifik anggota.
- **`Finance.jsx` & `AddTransaction.jsx`**: Halaman manajemen keuangan (Kas). Menampilkan pemasukan, pengeluaran, saldo, dan form pencatatan transaksi baru.
- **`Activities.jsx` & `ActivityDetail.jsx`**: Halaman direktori kegiatan Karang Taruna dan detail kegiatannya.
- **`Announcements.jsx`**: Papan pengumuman internal organisasi.
- **`ActivityGallery.jsx` & `Gallery.jsx`**: Menampilkan kumpulan dokumentasi foto kegiatan dengan tata letak *masonry grid*.
- **`Profile.jsx`**: Halaman untuk mengatur profil pengguna (foto, nama, kontak).
- **`UserApprovals.jsx`**: Panel khusus admin untuk menyetujui atau menolak pendaftaran akun baru.
- **`PendingApproval.jsx` & `AccountRejected.jsx`**: Halaman status yang ditampilkan jika akun pengguna belum disetujui atau ditolak oleh admin.

### File di `src/components/layout/`
- **`BottomNav.jsx`**: Navigasi bawah untuk tampilan mobile. Mengandung tombol *Floating Action Button (FAB)* yang menampilkan menu aksi cepat sesuai peran pengguna (misal: tambah kas, tambah anggota).

### File di `src/utils/`
- **`currency.js`**: Fungsi format angka ke dalam Rupiah (IDR).
- **`date.js`**: Fungsi format tanggal menggunakan format bahasa Indonesia.
- **`cloudinary.js`**: Utilitas untuk mengunggah gambar/foto langsung ke layanan Cloudinary.

## 3. Alur Aplikasi (User Journey)

1. **Akses Awal (Autentikasi)**
   - Pengguna baru mendaftar melalui halaman Register (`/register`).
   - Akun yang baru didaftarkan masuk ke dalam status *Pending* secara otomatis oleh Firebase Auth dan Firestore.
   - Pengguna yang mencoba login dengan status *Pending* akan diarahkan ke halaman `/pending`.
   - Admin (`super_admin`, `ketua`) mengakses `/user-approvals` untuk menyetujui akun tersebut.
   - Setelah disetujui, pengguna dapat masuk ke dalam sistem.

2. **Dashboard (Pusat Informasi)**
   - Setelah login, pengguna diarahkan ke `/dashboard`.
   - Di sini, pengguna melihat *Hero Banner*, statistik jumlah anggota, total kegiatan, dan total saldo kas (jika diizinkan).
   - *Widget* Kegiatan Terbaru, Pengumuman, dan Galeri Terbaru memberikan akses cepat ke informasi teraktual.
   - Panel navigasi utama berada di bagian bawah (`BottomNav`) untuk kemudahan akses di perangkat mobile.

3. **Eksplorasi Modul (Berdasarkan Peran)**
   - **Anggota Biasa**: Dapat melihat daftar anggota lain, membaca pengumuman, melihat detail kegiatan, dan melihat galeri foto.
   - **Bendahara**: Memiliki akses penuh ke modul Keuangan (`/finance`). Dapat melihat detail riwayat transaksi, ringkasan per sumber dana, mengekspor laporan CSV, dan mencatat transaksi baru.
   - **Sekretaris / Humas / Content Creator**: Dapat membuat Pengumuman baru, menambahkan Kegiatan, dan mengunggah Foto Galeri.
   - **Super Admin / Ketua**: Memiliki semua akses di atas, ditambah hak untuk menghapus pengguna, mengubah peran/jabatan anggota, mengatur gambar *Hero Banner* di halaman utama, dan menyetujui akun baru.

4. **Navigasi Cepat**
   - Di banyak halaman, pengguna dapat menekan tombol kembali (*Back*) di sudut kiri atas untuk kembali ke halaman sebelumnya.
   - Tombol tengah (FAB) pada navigasi bawah memberikan daftar aksi yang paling relevan untuk peran pengguna saat itu (misal: "Tambah Kegiatan" atau "Tambah Pemasukan").

## 4. Fitur Utama

1. **Sistem Autentikasi & Otorisasi Berbasis Peran (RBAC)**
   - Pendaftaran mandiri dengan proses *Approval* manual oleh Admin.
   - Hak akses disesuaikan dengan posisi di organisasi (Super Admin, Ketua, Wakil, Sekretaris, Bendahara, Humas, Content Creator, Anggota).

2. **Dashboard Informatif**
   - Rangkuman *Key Performance Indicators (KPI)* organisasi (jumlah anggota, kegiatan, kas).
   - Carousel spanduk/informasi (*Hero Banner*) yang dapat dikelola oleh Admin.
   - Akses cepat ke pengumuman dan foto terbaru.

3. **Manajemen Anggota (CRM Organisasi)**
   - Direktori lengkap seluruh anggota.
   - Detail profil anggota (kontak, alamat, peran).
   - Admin dapat menetapkan atau mengubah jabatan anggota secara dinamis.
   - Fitur *Export to CSV* untuk mengunduh daftar anggota.

4. **Sistem Keuangan & Kas (Buku Kas)**
   - Pencatatan pemasukan dan pengeluaran secara transparan.
   - Rangkuman saldo saat ini dan akumulasi berdasarkan *Kategori Sumber Dana* (contoh: Kas Bulanan, Kas Kegiatan).
   - Indikator visual hijau/merah untuk kemudahan membaca arus kas.
   - Fitur *Export to CSV* untuk menyusun laporan keuangan fisik.

5. **Pengelolaan Kegiatan & Galeri (Dokumentasi)**
   - Perencanaan kegiatan lengkap dengan tanggal, lokasi, dan deskripsi.
   - Pengunggahan foto dokumentasi pendukung.
   - Tampilan galeri foto bergaya *Masonry Grid* layaknya platform sosial modern.

6. **Pusat Informasi & Pengumuman**
   - Media berbagi informasi satu arah (*Broadcast*) dari pengurus ke seluruh anggota organisasi.
   - Teks pada pengumuman mendukung pembuatan tautan otomatis (*auto-linking*).

7. **Desain Mobile-First & Responsif**
   - Antarmuka yang terinspirasi oleh sistem iOS/Android (*Vibrant & Playful*).
   - Mendukung mode Gelap/Terang (*Dark Mode / Light Mode*).
   - *Bottom Navigation Bar* adaptif dengan *Floating Action Menu* untuk aksi cepat.

8. **Penyimpanan Cloud**
   - Menggunakan layanan **Firebase Firestore** untuk database NoSQL yang *realtime*.
   - Menggunakan layanan **Cloudinary** untuk manajemen dan optimasi aset gambar/foto tanpa membebani server utama.
