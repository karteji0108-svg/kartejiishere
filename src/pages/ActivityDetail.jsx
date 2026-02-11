import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in a real app, fetch based on ID
  const activity = {
    id: id,
    title: 'Gotong Royong Bersih Desa',
    date: '12 Oktober 2023',
    time: '07:00 - 10:00 WIB',
    location: 'Balai Desa & Lingkungan Sekitar',
    description: 'Mari bersama-sama membersihkan lingkungan balai desa dan sekitarnya untuk kenyamanan bersama. Kegiatan ini akan melibatkan seluruh pemuda dan warga desa untuk menciptakan lingkungan yang bersih, sehat, dan asri. Harap membawa peralatan kebersihan masing-masing jika ada (sapu lidi, sabit, cangkul). Konsumsi akan disediakan oleh panitia.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASy66xcZSwNkxy2SHzPIGF0WyTcwUM1u9NMutAmqoU27cbo76c99aPz66bsU2JXx0rJ2JI85fjWqogTE3Mt_hf39-FHza1AQXUGG2-2mlLoS3n6-PDOjBThDG_kNPWDhWaIbiohI9I5hytmXRWgsVgZdmCZjpzqnUMQGC3P00e_beYu6ZQ76Kh5Y9ixmU9WrZ83YqyB2tI1RoGzNTXQYZvleubGK8oSacpB2BlFXQDuKdnKkSFZlby0yuPBCT6_f2HDmNtlV15wQg',
    status: 'Open',
    organizer: 'Divisi Lingkungan Hidup',
    contact: '0812-3456-7890 (Budi)'
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 min-h-screen shadow-2xl relative flex flex-col">
        {/* Image Header with Back Button */}
        <div className="relative h-64 shrink-0">
          <img
            alt={activity.title}
            className="w-full h-full object-cover"
            src={activity.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          <button
            onClick={handleBack}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors z-20"
          >
            <span className="material-icons-round">arrow_back</span>
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="inline-block px-2 py-1 bg-green-500 rounded-lg text-xs font-bold mb-2 shadow-sm">
              {activity.status}
            </span>
            <h1 className="text-2xl font-bold leading-tight shadow-black drop-shadow-sm">{activity.title}</h1>
          </div>
        </div>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24">
          {/* Info Chips */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
              <span className="material-icons-round text-primary text-base mr-2">event</span>
              {activity.date}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
              <span className="material-icons-round text-primary text-base mr-2">schedule</span>
              {activity.time}
            </div>
          </div>

          <div className="space-y-6">
            {/* Location Section */}
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Lokasi</h2>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-primary shrink-0">
                  <span className="material-icons-round">place</span>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{activity.location}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Klik untuk lihat di peta</p>
                </div>
              </div>
              {/* Fake Map Placeholder */}
              <div className="mt-3 w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden relative flex items-center justify-center">
                <span className="material-icons-round text-4xl text-gray-400">map</span>
                <div className="absolute inset-0 bg-gray-500/10"></div>
              </div>
            </div>

            {/* Description Section */}
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Deskripsi</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {activity.description}
              </p>
            </div>

            {/* Organizer Info */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Diselenggarakan oleh</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{activity.organizer}</p>
                </div>
                <button className="text-primary text-sm font-medium hover:underline">
                  Hubungi Panitia
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 safe-area-bottom z-30">
          <button className="w-full py-3.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98]">
            Ikuti Kegiatan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
