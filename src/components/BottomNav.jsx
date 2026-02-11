import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Anggota', path: '/members', icon: 'groups' },
    { name: 'Kegiatan', path: '/activities', icon: 'event' },
    { name: 'Keuangan', path: '/finance', icon: 'account_balance_wallet' },
    { name: 'Info', path: '/announcements', icon: 'campaign' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe pt-2 px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-end pb-4 sm:pb-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 min-w-[3.5rem] group ${
                isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`material-icons-round text-[28px] transition-all duration-300 ${isActive ? 'text-primary' : 'group-hover:text-primary'}`}>
                  {item.icon}
                </span>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'font-semibold text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`}>
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
