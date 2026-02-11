import React from 'react';
import BottomNav from '../components/BottomNav';

const Announcements = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 min-h-screen flex justify-center">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-background-light dark:bg-background-dark min-h-screen shadow-2xl relative flex flex-col">
        {/* Header / Navigation Bar */}
        <header className="bg-surface-light dark:bg-surface-dark sticky top-0 z-30 shadow-sm safe-area-top px-4 pb-3">
          <div className="flex items-center justify-between pt-3">
            <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="material-icons-round text-gray-600 dark:text-gray-300">arrow_back_ios_new</span>
            </button>
            <h1 className="text-lg font-bold text-center flex-1 pr-8">Pengumuman</h1>
            {/* Placeholder for balance layout */}
            <div className="w-2"></div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6 pb-24">
          {/* Notification Settings Panel */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="pr-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Notifikasi</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Dapatkan info terbaru langsung di HP Anda.</p>
            </div>
            {/* iOS Style Toggle */}
            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
              <input
                defaultChecked
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:border-primary transition-all duration-300 left-0 checked:left-6 top-0"
                id="notification-toggle"
                name="toggle"
                type="checkbox"
              />
              <label
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-300"
                htmlFor="notification-toggle"
              ></label>
            </div>
          </div>

          {/* Announcement List (Feed) */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Terbaru</h3>

            {/* Card 1: Urgent */}
            <article className="group bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm border-l-4 border-red-500 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                  Penting
                </span>
                <span className="text-xs text-gray-400 font-medium">Hari ini, 10:00</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 leading-tight group-hover:text-primary transition-colors">Perubahan Jadwal Rapat Besar</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                Dikarenakan cuaca buruk yang diperkirakan terjadi nanti malam, rapat akbar bulan ini akan dipindahkan ke Balai Warga RW 05. Harap maklum.
              </p>
              <div className="mt-3 flex items-center text-xs font-medium text-primary cursor-pointer">
                Baca selengkapnya <span className="material-icons-round text-sm ml-1">arrow_forward</span>
              </div>
            </article>

            {/* Card 2: Social/Activity */}
            <article className="group bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                  Kegiatan
                </span>
                <span className="text-xs text-gray-400 font-medium">Kemarin</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 leading-tight group-hover:text-primary transition-colors">Kerja Bakti Minggu Ini</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                Mari berkumpul di balai desa jam 7 pagi untuk membersihkan lingkungan sekitar sungai. Peralatan kebersihan akan disediakan oleh panitia.
              </p>
            </article>

            {/* Card 3: Meeting */}
            <article className="group bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  Rapat
                </span>
                <span className="text-xs text-gray-400 font-medium">10 Okt 2023</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 leading-tight group-hover:text-primary transition-colors">Evaluasi Program Kerja Triwulan</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                Diundang kepada seluruh pengurus inti untuk menghadiri rapat evaluasi kinerja triwulan ke-3. Agenda meliputi laporan keuangan dan progres divisi.
              </p>
            </article>

            {/* Card 4: General Info with Image */}
            <article className="group bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow cursor-pointer">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 relative">
                <img
                  alt="Diverse group of young people working together on laptops"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNdHYD50mziqeXJHp6_YtnGaH46GCL3fL7CIM0UL-urKCbwh4_53OGE84M-fyPn5p9lzCOq4LZsuy5y_nEOTx-0ntJB6qypZvFQJA3Im3ChN3AeJZgeL43MRMsgpG9Q46Uh8RK1w26_l7pxp5kDOgPThWea2sgDClj5_fh_93_KKz-yI-5MUnIn50ikmikqxtXA9RDE3dYCLAEzBLkMDy30EOu1QV3DL1m5BUiLX91ExSRnZdx9AEpNn6VKD1jI1h6r1ACNu5LBlg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-2 left-4 right-4 flex justify-between items-end">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary text-white shadow-sm">
                    Umum
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-gray-400 font-medium">5 Okt 2023</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 leading-tight group-hover:text-primary transition-colors">Pendaftaran Anggota Baru Dibuka</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                  Ajak teman-teman pemuda di lingkunganmu untuk bergabung dengan Karang Taruna. Pendaftaran dibuka hingga akhir bulan ini.
                </p>
              </div>
            </article>
          </div>

          {/* End of List Indicator */}
          <div className="py-6 text-center">
            <p className="text-xs text-gray-400">Tidak ada pengumuman lainnya</p>
          </div>
        </main>

        {/* Floating Action Button (FAB) - Only for Admin/Secretary */}
        <button className="absolute bottom-24 right-4 z-40 bg-primary hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary active:scale-95">
          <span className="material-icons-round text-2xl">add</span>
        </button>

        <BottomNav />
      </div>
    </div>
  );
};

export default Announcements;
