import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { useRamadan } from '../context/RamadanContext';

const Inventory = () => {
  const { isRamadan } = useRamadan();
  const navigate = useNavigate();

  return (
    <div className={`app-container ${isRamadan ? 'bg-ramadan' : ''}`}>
      <header className="glass-header px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h1 className="text-h2">Inventaris</h1>
      </header>
      <main className="main-content px-6 pt-6 pb-24">
        <div className="text-center py-10 opacity-60">
          <span className="material-icons-round text-6xl mb-4">inventory_2</span>
          <p>Fitur Inventaris sedang dikembangkan.</p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};
export default Inventory;
