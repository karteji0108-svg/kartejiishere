import React from 'react';
import { NavLink } from 'react-router-dom';
import { isIOS } from '../../utils/platform';

const BottomNav = () => {
  const isIosDevice = isIOS();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav px-6 z-50 transition-all duration-300">
      <div className={`flex justify-around items-center h-20 safe-bottom-spacer ${isIosDevice ? 'pb-2' : ''}`}>
        {[
            { to: "/dashboard", icon: "home_app_logo", iconName: "home" },
            { to: "/activities", icon: "event", iconName: "event" },
            { to: "/menu", icon: "grid_view", iconName: "grid_view", isFab: true },
            { to: "/finance", icon: "wallet", iconName: "account_balance_wallet" },
            { to: "/profile", icon: "person", iconName: "person" }
        ].map((item) => (
            <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                    item.isFab
                    ? `flex items-center justify-center w-16 h-16 -mt-8 transition-transform duration-300 active:scale-90 ${isActive ? 'scale-110' : ''}`
                    : `flex flex-col items-center justify-center w-16 h-full gap-1 transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-600'}`
                }
            >
                {({ isActive }) => (
                    <>
                    {item.isFab ? (
                        <div className="w-16 h-16 bg-primary rounded-[24px] flex items-center justify-center shadow-xl shadow-primary/40 border-[6px] border-[#F7F9FC] dark:border-[#000000]">
                            <span className="material-icons-round text-white text-3xl">{item.iconName}</span>
                        </div>
                    ) : (
                        <span className={`material-icons-round text-3xl transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-md' : 'scale-100'}`}>
                            {item.iconName}
                        </span>
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
