const fs = require('fs');

let code = fs.readFileSync('src/components/common/WhatsNewModal.jsx', 'utf8');

code = code.replace(/const CURRENT_VERSION = '2.0.0';/, "const CURRENT_VERSION = '3.0.0';");

const newContent = `
            {/* UI Redesign */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
                    <span className="material-icons-round">update</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Versi 3.0.0 Telah Rilis!</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Kami telah melakukan banyak perbaikan bug, pengoptimalan kinerja aplikasi, dan peningkatan pengalaman pengguna.
                    </p>
                </div>
            </div>

            {/* Platform Adaptive */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                    <span className="material-icons-round">file_download</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Fitur Download Laporan</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Kini Anda dapat mengunduh laporan Keuangan dan daftar Anggota langsung ke dalam format CSV.
                    </p>
                </div>
            </div>

            {/* New Modules */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0 text-orange-600 dark:text-orange-400">
                    <span className="material-icons-round">image</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Galeri Terbaru di Dashboard</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Lihat foto-foto kegiatan terbaru langsung dari halaman Dashboard utama Anda.
                    </p>
                </div>
            </div>

            {/* Content Creator */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center shrink-0 text-pink-600 dark:text-pink-400">
                    <span className="material-icons-round">navigation</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Navigasi Lebih Mudah</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Tombol kembali telah ditambahkan di setiap halaman untuk mempermudah Anda berpindah halaman.
                    </p>
                </div>
            </div>
`;

code = code.replace(
/            \{\/\* UI Redesign \*\/\}\n            <div className="flex gap-4">[\s\S]*?<\/div>\n            <\/div>/,
newContent
);

fs.writeFileSync('src/components/common/WhatsNewModal.jsx', code);
