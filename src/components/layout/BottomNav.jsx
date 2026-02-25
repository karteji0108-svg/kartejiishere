import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
  const { hasRole } = useAuth();
  const canViewFinance = hasRole('bendahara') || hasRole('ketua') || hasRole('wakil_ketua') || hasRole('super_admin');

  const navItems = [
    { to: "/dashboard", icon: "home", label: "Home" },
    { to: "/activities", icon: "event", label: "Kegiatan" },
    { to: "/gallery", icon: "collections", label: "Galeri" },
    ...(canViewFinance ? [{ to: "/finance", icon: "account_balance_wallet", label: "Keuangan" }] : []),
    { to: "/profile", icon: "person", label: "Profil" }
  ];

  return (
    <nav className="glass-nav transition-all duration-300 z-50">
      <div className="flex justify-around items-center w-full h-full px-2">
        {navItems.map((item) => (
            <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                    `relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200 group ${
                        isActive
                        ? 'text-cyan-500 dark:text-cyan-400'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        {/* Active Pill Indicator (Background) */}
                        {isActive && (
                            <div className="absolute inset-x-2 top-2 bottom-2 bg-cyan-500/10 dark:bg-cyan-400/10 rounded-xl -z-10 animate-fade-in-up"></div>
                        )}

                        <span className={`material-icons-round text-2xl transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                            {item.icon}
                        </span>

                        <span className="text-[10px] font-medium tracking-wide">
                            {item.label}
                        </span>

                        {/* Active Indicator (Top Line) */}
                        {isActive && (
                            <span className="absolute -top-[1px] w-8 h-1 bg-cyan-500 rounded-b-full shadow-glow"></span>
                        )}
                    </>
                )}
            </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
