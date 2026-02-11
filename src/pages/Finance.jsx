import React from 'react';
import BottomNav from '../components/BottomNav';

const Finance = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-100 font-display min-h-screen pb-24 relative overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Top Safe Area (Simulated for iOS) */}
      <div className="h-12 w-full bg-background-light dark:bg-background-dark sticky top-0 z-50"></div>

      {/* Header Section */}
      <header className="px-5 pt-2 pb-6 flex items-center justify-between sticky top-12 z-40 bg-background-light dark:bg-background-dark transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Keuangan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ringkasan Bendahara</p>
        </div>
        <div className="relative group">
          <button className="flex items-center space-x-2 bg-white dark:bg-neutral-surface-dark px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span>September 2023</span>
            <span className="material-icons text-base">expand_more</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 space-y-6">
        {/* Balance Card (Primary Focal Point) */}
        <section className="relative overflow-hidden bg-primary rounded-xl p-6 shadow-lg shadow-primary/30 text-white">
          {/* Decorative Circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-primary-content text-sm font-medium opacity-90">Saldo Total</span>
              <span className="material-icons text-white/80">account_balance_wallet</span>
            </div>
            <h2 className="text-3xl font-bold mb-6 tracking-tight">Rp 15.450.000</h2>
            <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
              <div>
                <div className="flex items-center space-x-1 mb-1 text-primary-content text-xs uppercase font-semibold tracking-wider opacity-80">
                  <span className="material-icons text-sm">arrow_downward</span>
                  <span>Pemasukan</span>
                </div>
                <p className="text-lg font-semibold text-white">Rp 2.000.000</p>
              </div>
              <div>
                <div className="flex items-center space-x-1 mb-1 text-primary-content text-xs uppercase font-semibold tracking-wider opacity-80">
                  <span className="material-icons text-sm">arrow_upward</span>
                  <span>Pengeluaran</span>
                </div>
                <p className="text-lg font-semibold text-white">Rp 500.000</p>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Chart Section */}
        <section className="bg-white dark:bg-neutral-surface-dark rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Arus Kas</h3>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Mingguan</span>
          </div>
          {/* Custom CSS Chart Representation */}
          <div className="h-32 w-full flex items-end justify-between space-x-2 px-2">
            {[
              { day: 'Sen', val: '40%', active: false },
              { day: 'Sel', val: '25%', active: false },
              { day: 'Rab', val: '60%', active: false },
              { day: 'Kam', val: '85%', active: true },
              { day: 'Jum', val: '45%', active: false },
              { day: 'Sab', val: '30%', active: false },
              { day: 'Min', val: '20%', active: false },
            ].map((item) => (
              <div key={item.day} className="flex flex-col items-center gap-2 group w-full">
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-sm relative h-24 flex items-end justify-center overflow-hidden">
                  <div
                    className={`w-full ${item.active ? 'bg-primary group-hover:bg-primary-dark' : 'bg-primary/40 group-hover:bg-primary/50'} transition-all duration-300`}
                    style={{ height: item.val }}
                  ></div>
                </div>
                <span className={`text-[10px] ${item.active ? 'text-gray-900 font-bold dark:text-white' : 'text-gray-400'}`}>{item.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Transaction List */}
        <section>
          <div className="flex items-center justify-between mb-4 mt-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Transaksi Terakhir</h3>
            <a className="text-sm font-medium text-primary hover:text-primary-dark" href="#">Lihat Semua</a>
          </div>
          <div className="space-y-3">
            {/* Transaction Item: Income */}
            <div className="flex items-center justify-between bg-white dark:bg-neutral-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.99] transition-transform">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                  <span className="material-icons text-xl">volunteer_activism</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Donasi Warga</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">07 Sep 2023 • RW 05</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600 dark:text-green-400 text-sm">+ Rp 500.000</p>
              </div>
            </div>
            {/* Transaction Item: Expense */}
            <div className="flex items-center justify-between bg-white dark:bg-neutral-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.99] transition-transform">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                  <span className="material-icons text-xl">restaurant</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Konsumsi Rapat</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">05 Sep 2023 • Warung Bu Ani</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600 dark:text-red-400 text-sm">- Rp 150.000</p>
              </div>
            </div>
            {/* Transaction Item: Income */}
            <div className="flex items-center justify-between bg-white dark:bg-neutral-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.99] transition-transform">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary dark:text-primary">
                  <span className="material-icons text-xl">group</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Iuran Anggota</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">02 Sep 2023 • Dani</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600 dark:text-green-400 text-sm">+ Rp 50.000</p>
              </div>
            </div>
            {/* Transaction Item: Income */}
            <div className="flex items-center justify-between bg-white dark:bg-neutral-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.99] transition-transform">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary dark:text-primary">
                  <span className="material-icons text-xl">group</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Iuran Anggota</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">02 Sep 2023 • Siti</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600 dark:text-green-400 text-sm">+ Rp 50.000</p>
              </div>
            </div>
            {/* Transaction Item: Expense */}
            <div className="flex items-center justify-between bg-white dark:bg-neutral-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.99] transition-transform opacity-75">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                  <span className="material-icons text-xl">print</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Cetak Proposal</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">01 Sep 2023 • Toko Jaya</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600 dark:text-red-400 text-sm">- Rp 35.000</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button (FAB) */}
      <button className="fixed right-5 bottom-24 z-30 h-14 w-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:bg-primary-dark transition-colors transform hover:scale-105 active:scale-95">
        <span className="material-icons text-2xl">add</span>
      </button>

      <BottomNav />
    </div>
  );
};

export default Finance;
