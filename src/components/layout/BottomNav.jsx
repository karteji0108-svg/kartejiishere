import React from 'react';
import { NavLink } from 'react-router-dom';
import { isIOS } from '../../utils/platform';

const BottomNav = () => {
  const isIosDevice = isIOS();

  // Platform-specific active indicator
  const getActiveStyle = (isActive) => {
      if (isIosDevice) {
          // iOS: Icon color change only, maybe scale
          return isActive ? 'text-primary scale-110' : 'text-slate-400 dark:text-slate-500';
      } else {
          // Android: Material 3 style pill
          return isActive ? 'text-primary' : 'text-slate-500';
      }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav px-6 z-50 transition-all duration-300">
      <div className={`flex justify-around items-center h-16 safe-bottom-spacer ${isIosDevice ? 'pb-2' : ''}`}>
        {/* Helper to render Nav Items */}
        {[
            { to: "/dashboard", icon: "dashboard", label: "Home" },
            { to: "/activities", icon: "event", label: "Acara" },
            { to: "/menu", icon: "grid_view", label: "Menu", isFab: true }, // Center FAB now Menu
            { to: "/finance", icon: "account_balance_wallet", label: "Kas" },
            { to: "/profile", icon: "person", label: "Profil" }
        ].map((item) => (
            <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                    item.isFab
                    ? `flex flex-col items-center justify-center w-14 h-full gap-1 transition-all ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`
                    : `flex flex-col items-center justify-center ${isIosDevice ? 'w-12' : 'w-16'} h-full gap-1 transition-all ${getActiveStyle(isActive)}`
                }
            >
                {({ isActive }) => (
                    <>
                    {item.isFab ? (
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 -mt-8 border-4 border-white dark:border-slate-900">
                            <span className="material-icons-round text-white text-[24px]">{item.icon}</span>
                        </div>
                    ) : (
                        <>
                            {/* Android Active Indicator Pill */}
                            {!isIosDevice && isActive && (
                                <div className="absolute w-12 h-8 bg-primary/10 rounded-full -z-10"></div>
                            )}

                            <span className={`material-icons-round text-[26px] transition-transform duration-300 z-10 ${isActive && isIosDevice ? '-translate-y-1' : ''}`}>
                                {item.icon}
                            </span>

                            {/* Labels: iOS hides them usually or keeps small. Android M3 shows them. */}
                            <span className={`text-[10px] font-bold transition-opacity duration-300 z-10 ${isActive ? 'opacity-100' : 'opacity-0 hidden'} ${isIosDevice ? 'mt-0.5' : ''}`}>
                                {item.label}
                            </span>

                            {/* iOS Dot Indicator */}
                            {isIosDevice && !isActive && <div className="w-1 h-1 rounded-full bg-transparent mt-1"></div>}
                        </>
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
