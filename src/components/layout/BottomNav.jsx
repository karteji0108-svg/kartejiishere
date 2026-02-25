import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
  const { hasRole } = useAuth();
  const canViewFinance = hasRole('bendahara') || hasRole('ketua') || hasRole('wakil_ketua') || hasRole('super_admin');
  const location = useLocation();
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const navItems = [
    { to: "/dashboard", icon: "home", label: "Home" },
    { to: "/activities", icon: "event", label: "Kegiatan" },
    { to: "/gallery", icon: "collections", label: "Galeri" },
    ...(canViewFinance ? [{ to: "/finance", icon: "account_balance_wallet", label: "Keuangan" }] : []),
    { to: "/profile", icon: "person", label: "Profil" }
  ];

  // Calculate active index based on current path
  const activeIndex = navItems.findIndex(item => location.pathname.startsWith(item.to));

  useEffect(() => {
    // Update indicator position
    if (navRef.current && activeIndex !== -1) {
        const itemWidth = navRef.current.offsetWidth / navItems.length;
        const leftPosition = itemWidth * activeIndex + (itemWidth / 2) - 24; // 24 is half of blob width (48px)

        setIndicatorStyle({
            transform: `translateX(${leftPosition}px)`,
            width: '48px',
            height: '48px'
        });
    }
  }, [activeIndex, navItems.length]);

  return (
    <nav ref={navRef} className="glass-nav transition-all duration-300 animate-fade-in-up px-0 relative">

      {/* Liquid Indicator Blob */}
      <div
        className="absolute top-1/2 -mt-6 left-0 bg-cyan-400/30 dark:bg-cyan-500/20 rounded-full blur-md transition-all duration-500 cubic-bezier(0.68, -0.55, 0.27, 1.55) pointer-events-none z-0"
        style={indicatorStyle}
      >
         <div className="w-full h-full bg-cyan-400/40 dark:bg-cyan-500/30 rounded-full blur-sm animate-pulse"></div>
      </div>

      <div className="flex justify-around items-center w-full h-full relative z-10">
        {navItems.map((item, index) => (
            <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                    `flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 relative group ${
                        isActive
                        ? 'text-cyan-500 dark:text-cyan-400 -translate-y-3 scale-110'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <div className="relative p-1.5 transition-colors">
                            <span className={`material-icons-round text-2xl transition-all duration-300 ${isActive ? 'drop-shadow-glow text-3xl' : ''}`}>
                                {item.icon}
                            </span>
                        </div>

                        {/* Label (Optional: hide on active or keep) */}
                        <span className={`text-[10px] font-medium tracking-wide transition-all duration-300 ${isActive ? 'opacity-100 font-bold' : 'opacity-0 scale-0'}`}>
                            {item.label}
                        </span>

                        {/* Active Dot (Keep it as a secondary detail) */}
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
