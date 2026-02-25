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
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 shadow-nav pb-safe z-50">
      <div className="flex justify-around items-center h-16 w-full">
        {navItems.map((item) => (
            <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                    `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                        isActive
                        ? 'text-accent dark:text-blue-400'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <span className={`material-icons-round text-2xl transition-transform ${isActive ? '-translate-y-0.5' : ''}`}>
                            {item.icon}
                        </span>

                        <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>
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
