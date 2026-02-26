import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
  const { hasRole } = useAuth();
  const location = useLocation();

  // Roles checking
  const canViewFinance = hasRole('bendahara') || hasRole('ketua') || hasRole('wakil_ketua') || hasRole('super_admin');

  // Navigation Items
  let navItems = [
    { to: "/dashboard", icon: "home", label: "Beranda" },
    { to: "/activities", icon: "event_note", label: "Kegiatan" },
    { to: "/gallery", icon: "photo_library", label: "Galeri" },
  ];

  // Conditional Items (Finance vs Info)
  if (canViewFinance) {
      navItems.push({ to: "/finance", icon: "account_balance_wallet", label: "Keuangan" });
  } else {
      navItems.push({ to: "/announcements", icon: "campaign", label: "Info" });
  }

  // Profile always last
  navItems.push({ to: "/profile", icon: "person", label: "Profil" });


  // Hide BottomNav on Auth pages or standalone pages
  if (['/', '/register', '/login'].includes(location.pathname)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-safe">
      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] pointer-events-auto pb-safe">
        <div className="flex justify-around items-center h-[72px] max-w-lg mx-auto px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-300 group select-none touch-manipulation font-medium
                ${isActive ? 'text-primary dark:text-blue-400 font-bold' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`
                        p-1.5 rounded-2xl transition-all duration-300 flex items-center justify-center
                        ${isActive
                            ? 'bg-primary/10 dark:bg-blue-400/10 -translate-y-1 scale-110 shadow-sm shadow-primary/20'
                            : 'group-active:scale-95'
                        }
                    `}
                  >
                    <span className="material-icons-round text-[24px]">
                      {item.icon}
                    </span>
                  </div>

                  <span className={`text-[10px] tracking-tight transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                    {item.label}
                  </span>

                  {isActive && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-current animate-fade-in" />
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
