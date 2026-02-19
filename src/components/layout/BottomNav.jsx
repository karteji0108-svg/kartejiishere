import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav pb-safe pt-2 px-6 z-50">
      <div className="flex justify-around items-center h-16">
        <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full gap-1 transition-all ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
            {({ isActive }) => (
                <>
                <span className={`material-icons-round text-[28px] transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`}>dashboard</span>
                <span className={`text-[10px] font-bold transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 hidden'}`}>Home</span>
                {!isActive && <div className="w-1 h-1 rounded-full bg-transparent mt-1"></div>}
                </>
            )}
        </NavLink>

        <NavLink to="/members" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full gap-1 transition-all ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
            {({ isActive }) => (
                <>
                <span className={`material-icons-round text-[28px] transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`}>groups</span>
                <span className={`text-[10px] font-bold transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 hidden'}`}>Warga</span>
                {!isActive && <div className="w-1 h-1 rounded-full bg-transparent mt-1"></div>}
                </>
            )}
        </NavLink>

         <NavLink to="/activities" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full gap-1 transition-all ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
            {({ isActive }) => (
                <>
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 -mt-8 border-4 border-white dark:border-slate-900">
                    <span className="material-icons-round text-white text-[24px]">event</span>
                </div>
                </>
            )}
        </NavLink>

        <NavLink to="/finance" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full gap-1 transition-all ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
            {({ isActive }) => (
                <>
                <span className={`material-icons-round text-[28px] transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`}>account_balance_wallet</span>
                <span className={`text-[10px] font-bold transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 hidden'}`}>Kas</span>
                {!isActive && <div className="w-1 h-1 rounded-full bg-transparent mt-1"></div>}
                </>
            )}
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full gap-1 transition-all ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
            {({ isActive }) => (
                <>
                <span className={`material-icons-round text-[28px] transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`}>person</span>
                <span className={`text-[10px] font-bold transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 hidden'}`}>Profil</span>
                {!isActive && <div className="w-1 h-1 rounded-full bg-transparent mt-1"></div>}
                </>
            )}
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
