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
    <nav className="glass-nav transition-all duration-300 animate-fade-in-up">
      <div className="flex justify-around items-center w-full px-2">
        {navItems.map((item) => (
            <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                    `flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 relative group ${
                        isActive
                        ? 'text-cyan-500 dark:text-cyan-400 -translate-y-2 scale-110'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                         {/* Glowing Backdrop for Active Item */}
                        {isActive && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-md animate-pulse"></div>
                        )}

                        <div className="relative z-10 p-1.5 transition-colors">
                            <span className={`material-icons-round text-2xl transition-transform duration-300 ${isActive ? 'drop-shadow-glow' : ''}`}>
                                {item.icon}
                            </span>
                        </div>

                        {/* Active Dot Indicator */}
                        {isActive && (
                            <span className="absolute -bottom-2 w-1 h-1 bg-cyan-500 rounded-full shadow-glow"></span>
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
