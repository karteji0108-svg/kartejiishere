import React from 'react';
import BottomNav from '../components/BottomNav';

const Activities = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display min-h-screen flex flex-col items-center justify-center">
      {/* Mobile Container */}
      <div className="w-full max-w-md h-screen bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col relative">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 px-5 pt-12 pb-4 sticky top-0 z-20 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Kegiatan</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Agenda Karang Taruna</p>
          </div>
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
            <span className="material-icons">filter_list</span>
          </button>
        </header>

        {/* Main Content: Activity List */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-24 space-y-5">
          {/* Search Bar */}
          <div className="relative mb-6">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <span className="material-icons text-xl">search</span>
            </span>
            <input
              className="w-full py-2.5 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="Cari kegiatan..."
              type="text"
            />
          </div>

          {/* Month Section Header */}
          <div className="flex items-center space-x-2 pb-1">
            <span className="material-icons text-primary text-sm">event</span>
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Oktober 2023</h2>
          </div>

          {/* Card 1: Upcoming/Featured */}
          <div className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="relative h-40 overflow-hidden">
              <img
                alt="Group of people cleaning a park"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuASy66xcZSwNkxy2SHzPIGF0WyTcwUM1u9NMutAmqoU27cbo76c99aPz66bsU2JXx0rJ2JI85fjWqogTE3Mt_hf39-FHza1AQXUGG2-2mlLoS3n6-PDOjBThDG_kNPWDhWaIbiohI9I5hytmXRWgsVgZdmCZjpzqnUMQGC3P00e_beYu6ZQ76Kh5Y9ixmU9WrZ83YqyB2tI1RoGzNTXQYZvleubGK8oSacpB2BlFXQDuKdnKkSFZlby0yuPBCT6_f2HDmNtlV15wQg"
              />
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex flex-col items-center shadow-sm">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Okt</span>
                <span className="text-xl font-bold text-primary leading-none">12</span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 text-xs px-2.5 py-1 rounded-full font-medium">Open</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Gotong Royong Bersih Desa</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                Mari bersama-sama membersihkan lingkungan balai desa dan sekitarnya untuk kenyamanan bersama.
              </p>
              <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 mb-4 space-x-3">
                <div className="flex items-center">
                  <span className="material-icons text-sm mr-1">schedule</span>
                  07:00 - 10:00 WIB
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-sm mr-1">place</span>
                  Balai Desa
                </div>
              </div>
              <button className="w-full py-2.5 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2">
                <span>Lihat Detail</span>
                <span className="material-icons text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 2: Meeting */}
          <div className="flex bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="w-24 bg-primary/10 dark:bg-primary/20 flex flex-col items-center justify-center p-2 border-r border-slate-100 dark:border-slate-700 shrink-0">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Okt</span>
              <span className="text-2xl font-bold text-primary">15</span>
              <span className="text-xs text-slate-400 mt-1">Minggu</span>
            </div>
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white leading-tight mb-1">Rapat Bulanan</h3>
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-medium uppercase">Wajib</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  Evaluasi program kerja bulan September dan perencanaan kegiatan akhir tahun.
                </p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center text-xs text-slate-400 dark:text-slate-500">
                  <span className="material-icons text-sm mr-1">schedule</span>
                  19:00 WIB
                </div>
                <button className="text-primary text-xs font-semibold hover:text-blue-600 transition-colors flex items-center">
                  Detail
                  <span className="material-icons text-sm ml-0.5">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Sports Event */}
          <div className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="relative h-32 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <img
                alt="Badminton rackets and shuttlecock"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe1Hx9gknNK_rE6_74DC6lxR0zCkEbG_qyrKC-dgG3npg-nib5-aQWoQaQ9dP51l-YIqg2kXm1ZKa9c2ftgJt8VRO_-kWCfkb7wrWvvYIkv_8y0YkHapvdgOYfqSWEn9xsI6lL4ZM-MoQDCZFmREf7l4G1uF_8LjQraRIVfsAHAy8pStmTM28il3cAMxJ2RjtqB8e6JYzIUTBRxUjag6OqRb6vRNZA3CS0V0jOFP-4Xb_2BhyWsykVtJ3Cxf6lJnrg-Z6aWI9KOQU"
              />
              <div className="absolute bottom-3 left-3 z-20 text-white">
                <h3 className="text-lg font-bold leading-tight shadow-black drop-shadow-md">Turnamen Badminton</h3>
                <p className="text-xs text-slate-200 flex items-center mt-1">
                  <span className="material-icons text-sm mr-1">place</span>
                  GOR Kecamatan
                </p>
              </div>
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex flex-col items-center shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Okt</span>
                  <span className="text-lg font-bold text-primary leading-none">20</span>
                </div>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                Kompetisi olahraga antar RT untuk mempererat tali silaturahmi pemuda. Siapkan tim terbaikmu!
              </p>
              <button className="w-full py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-primary dark:text-blue-400 font-medium rounded-lg text-sm transition-colors border border-slate-100 dark:border-slate-700">
                Lihat Detail
              </button>
            </div>
          </div>

          {/* Month Section Header Next Month */}
          <div className="flex items-center space-x-2 pt-4 pb-1">
            <span className="material-icons text-primary text-sm">event</span>
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">November 2023</h2>
          </div>

          {/* Card 4: Next Month Event */}
          <div className="flex bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
            <div className="w-24 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center p-2 border-r border-slate-100 dark:border-slate-700 shrink-0">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Nov</span>
              <span className="text-2xl font-bold text-slate-400 dark:text-slate-500">05</span>
            </div>
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white leading-tight mb-1">Pelatihan Kewirausahaan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  Workshop digital marketing untuk UMKM pemuda.
                </p>
              </div>
              <div className="flex items-center justify-end mt-2">
                <button className="text-slate-500 hover:text-primary transition-colors text-xs font-medium flex items-center">
                  Detail
                  <span className="material-icons text-sm ml-0.5">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* End of list placeholder */}
          <div className="text-center py-6">
            <p className="text-xs text-slate-400">Anda telah mencapai akhir daftar.</p>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
};

export default Activities;
