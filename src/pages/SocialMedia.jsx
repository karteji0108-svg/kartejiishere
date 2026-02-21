import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';

const SocialMedia = () => {
    const navigate = useNavigate();

  const accounts = [
    {
      id: 1,
      name: 'Karteji Official',
      platform: 'Instagram',
      handle: '@karteji0108',
      url: 'https://www.instagram.com/karteji0108?igsh=MTZpbmFuZW1oZnBlYg%3D%3D&utm_source=qr',
      color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500',
      icon: 'camera_alt'
    },
    {
      id: 2,
      name: 'Karteji Official',
      platform: 'TikTok',
      handle: '@karteji8',
      url: 'https://www.tiktok.com/@karteji8?_r=1&_t=ZS-944RmPfXNiS',
      color: 'bg-black',
      icon: 'music_note'
    }
  ];

  return (
    <div className={`app-container `}>
      <header className="glass-header px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h1 className="text-h2">Sosial Media</h1>
      </header>

      <main className="main-content px-6 pt-6 pb-24">
        <div className="space-y-4">
          {accounts.map((acc) => (
            <a
              key={acc.id}
              href={acc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${acc.color}`}>
                <span className="material-icons-round text-2xl">{acc.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{acc.name}</h3>
                <p className="text-sm opacity-70">{acc.platform} • {acc.handle}</p>
              </div>
              <span className="material-icons-round text-slate-400 group-hover:text-primary transition-colors">open_in_new</span>
            </a>
          ))}
        </div>

        <div className="mt-8 text-center opacity-60 text-xs px-4">
            <p>Klik kartu untuk membuka aplikasi sosial media.</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default SocialMedia;
