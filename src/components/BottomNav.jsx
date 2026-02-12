import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-end pb-4 sm:pb-2">
        <NavLink to="/dashboard" className="flex flex-col items-center gap-1 min-w-[3.5rem] group">
            {({ isActive }) => (
                <>
                <span className={`material-icons-round text-[28px] transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>dashboard</span>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'font-semibold text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>Dashboard</span>
                </>
            )}
        </NavLink>
        <NavLink to="/members" className="flex flex-col items-center gap-1 min-w-[3.5rem] group">
            {({ isActive }) => (
                <>
                <span className={`material-icons-round text-[28px] transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>groups</span>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'font-semibold text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>Anggota</span>
                </>
            )}
        </NavLink>
         <NavLink to="/activities" className="flex flex-col items-center gap-1 min-w-[3.5rem] group">
            {({ isActive }) => (
                <>
                <span className={`material-icons-round text-[28px] transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>event</span>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'font-semibold text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>Kegiatan</span>
                </>
            )}
        </NavLink>
        <NavLink to="/finance" className="flex flex-col items-center gap-1 min-w-[3.5rem] group">
            {({ isActive }) => (
                <>
                <span className={`material-icons-round text-[28px] transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>account_balance_wallet</span>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'font-semibold text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>Keuangan</span>
                </>
            )}
        </NavLink>
        <NavLink to="/profile" className="flex flex-col items-center gap-1 min-w-[3.5rem] group">
            {({ isActive }) => (
                <>
                <span className={`material-icons-round text-[28px] transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>person</span>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'font-semibold text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>Profil</span>
                </>
            )}
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
