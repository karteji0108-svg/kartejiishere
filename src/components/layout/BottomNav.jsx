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
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe z-50 pointer-events-none">
      <nav className="mx-auto max-w-md bg-white/90 dark:bg-surface-dark/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg rounded-2xl pointer-events-auto">
        <div className="flex justify-around items-center h-16 w-full px-2">
          {navItems.map((item) => (
              <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                      `relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-300 ${
                          isActive
                          ? 'text-accent dark:text-blue-400 -translate-y-1'
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`
                  }
              >
                  {({ isActive }) => (
                      <>
                          <span className={`material-icons-round text-2xl transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                              {item.icon}
                          </span>

                          {isActive && (
                              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-current transition-all duration-300 animate-fade-in" />
                          )}
                      </>
                  )}
              </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default BottomNav;
