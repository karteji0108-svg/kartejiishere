const fs = require('fs');

const bottomNavCode = `import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
  const { hasRole, userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // Roles checking
  const canViewFinance = hasRole('bendahara') || hasRole('ketua') || hasRole('wakil_ketua') || hasRole('super_admin');

  // Define available actions based on roles
  const allActions = [
    {
        to: "/activities/create",
        icon: "event",
        label: "Kegiatan",
        bg: "bg-slate-700",
        allowed: ['super_admin', 'ketua', 'sekretaris', 'content_creator']
    },
    {
        to: "/announcements/create",
        icon: "campaign",
        label: "Info",
        bg: "bg-slate-700",
        allowed: ['super_admin', 'ketua', 'sekretaris', 'humas', 'content_creator']
    },
    {
        to: "/finance/add",
        icon: "receipt_long",
        label: "Transaksi",
        bg: "bg-slate-700",
        allowed: ['super_admin', 'bendahara', 'ketua']
    },
    {
        to: "/gallery/add",
        icon: "add_photo_alternate",
        label: "Galeri",
        bg: "bg-slate-700",
        allowed: ['super_admin', 'content_creator', 'sekretaris']
    },
  ];

  const quickActions = allActions.filter(action =>
    action.allowed.includes(userRole)
  );

  // Hide BottomNav on Auth pages or standalone pages
  if (['/', '/register', '/login'].includes(location.pathname)) return null;

  return (
    <>
        {/* Overlay for Expanded Menu */}
        <div
            className={\`
                fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 transition-opacity duration-300
                \${isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            \`}
            onClick={() => setIsExpanded(false)}
        />

        {/* Floating Quick Action Menu (Glassmorphism) */}
        <div
            className={\`
                fixed bottom-28 left-1/2 -translate-x-1/2 z-50 w-64 origin-bottom
                transition-all duration-300 ease-out
                \${isExpanded
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-8 pointer-events-none'
                }
            \`}
        >
             <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/40 dark:border-white/10 p-2 overflow-hidden">
                 {quickActions.length > 0 ? (
                     <div className="flex flex-col gap-1">
                         {quickActions.map((action, idx) => (
                             <button
                                key={idx}
                                onClick={() => {
                                    setIsExpanded(false);
                                    navigate(action.to);
                                }}
                                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors w-full text-left"
                             >
                                 <span className="material-icons-round text-slate-600 dark:text-slate-300 text-[20px]">{action.icon}</span>
                                 <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{action.label}</span>
                             </button>
                         ))}
                     </div>
                 ) : (
                     <div className="text-center py-4">
                         <span className="material-icons-round text-slate-400 text-3xl mb-1">block</span>
                         <p className="text-xs text-slate-500 font-medium">No actions available.</p>
                     </div>
                 )}
             </div>
        </div>

        {/* Liquid Glass Bottom Navigation */}
        <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pb-safe px-4 pointer-events-none">
            <nav className="pointer-events-auto w-full max-w-[360px] h-[64px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/50 dark:border-white/10 flex justify-between items-center px-2 relative">

                {/* Left side links */}
                <div className="flex flex-1 justify-around items-center h-full">
                    <NavLink
                        to="/dashboard"
                        className={({isActive}) => \`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 \${isActive ? 'text-slate-900 dark:text-white bg-white/50 dark:bg-white/10 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
                    >
                        <span className="material-icons-round text-[22px]">dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/activities"
                        className={({isActive}) => \`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 \${isActive ? 'text-slate-900 dark:text-white bg-white/50 dark:bg-white/10 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
                    >
                        <span className="material-icons-round text-[22px]">event_note</span>
                    </NavLink>
                </div>

                {/* FAB - Morphing Liquid Center */}
                <div className="relative flex justify-center items-center w-16 h-16 -mt-6">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={\`
                            w-14 h-14 rounded-full flex items-center justify-center
                            shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out border border-white/40 dark:border-white/10 backdrop-blur-md
                            \${isExpanded
                                ? 'bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white rotate-45 scale-95'
                                : 'bg-slate-900/90 dark:bg-slate-100/90 text-white dark:text-slate-900 hover:scale-105 active:scale-95'
                            }
                        \`}
                    >
                        <span className="material-icons-round text-[24px]">add</span>
                    </button>
                </div>

                {/* Right side links */}
                <div className="flex flex-1 justify-around items-center h-full">
                    {canViewFinance ? (
                        <NavLink
                            to="/finance"
                            className={({isActive}) => \`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 \${isActive ? 'text-slate-900 dark:text-white bg-white/50 dark:bg-white/10 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
                        >
                            <span className="material-icons-round text-[22px]">account_balance</span>
                        </NavLink>
                    ) : (
                        <NavLink
                            to="/announcements"
                            className={({isActive}) => \`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 \${isActive ? 'text-slate-900 dark:text-white bg-white/50 dark:bg-white/10 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
                        >
                            <span className="material-icons-round text-[22px]">campaign</span>
                        </NavLink>
                    )}

                    <NavLink
                        to="/profile"
                        className={({isActive}) => \`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 \${isActive ? 'text-slate-900 dark:text-white bg-white/50 dark:bg-white/10 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
                    >
                        <span className="material-icons-round text-[22px]">person</span>
                    </NavLink>
                </div>

            </nav>
        </div>
    </>
  );
};

export default BottomNav;
`;

fs.writeFileSync('src/components/layout/BottomNav.jsx', bottomNavCode);
