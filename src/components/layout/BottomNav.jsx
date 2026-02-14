import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav pb-safe pt-2 px-6 z-50">
      <div className="flex justify-between items-end pb-4 sm:pb-2">
        <NavLink to="/dashboard" className="flex flex-col items-center gap-1 min-w-[3.5rem] group">
            {({ isActive }) => (
                <>
                <div className={`p-1 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/10 -translate-y-1' : ''}`}>
                    <span className={`material-icons-round text-[28px] transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>dashboard</span>
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'font-semibold text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>Dashboard</span>
                </>
            )}
        </NavLink>
        <NavLink to="/members" className="flex flex-col items-center gap-1 min-w-[3.5rem] group">
            {({ isActive }) => (
                <>
                <div className={`p-1 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/10 -translate-y-1' : ''}`}>
                    <span className={`material-icons-round text-[28px] transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>groups</span>
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'font-semibold text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>Anggota</span>
                </>
            )}
        </NavLink>
         <NavLink to="/activities" className="flex flex-col items-center gap-1 min-w-[3.5rem] group">
            {({ isActive }) => (
                <>
                <div className={`p-1 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/10 -translate-y-1' : ''}`}>
                    <span className={`material-icons-round text-[28px] transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>event</span>
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'font-semibold text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>Kegiatan</span>
                </>
            )}
        </NavLink>
        <NavLink to="/finance" className="flex flex-col items-center gap-1 min-w-[3.5rem] group">
            {({ isActive }) => (
                <>
                <div className={`p-1 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/10 -translate-y-1' : ''}`}>
                    <span className={`material-icons-round text-[28px] transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>account_balance_wallet</span>
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'font-semibold text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>Keuangan</span>
                </>
            )}
        </NavLink>
        <NavLink to="/profile" className="flex flex-col items-center gap-1 min-w-[3.5rem] group">
            {({ isActive }) => (
                <>
                <div className={`p-1 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/10 -translate-y-1' : ''}`}>
                    <span className={`material-icons-round text-[28px] transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>person</span>
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'font-semibold text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>Profil</span>
                </>
            )}
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
