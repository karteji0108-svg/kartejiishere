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
    <nav className="glass-nav transition-all duration-300">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto md:max-w-4xl px-2">
        {navItems.map((item) => (
            <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                    `flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200 ${
                        isActive
                        ? 'text-blue-600 dark:text-blue-400 transform scale-105'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <div className={`relative p-1.5 rounded-xl transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                            <span className={`material-icons-round text-2xl transition-transform ${isActive ? '-translate-y-0.5' : ''}`}>
                                {item.icon}
                            </span>
                        </div>
                        <span className="text-[10px] font-medium tracking-wide">
                            {item.label}
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
