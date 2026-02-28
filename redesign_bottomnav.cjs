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
                fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-200
                \${isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            \`}
            onClick={() => setIsExpanded(false)}
        />

        {/* Floating Quick Action Menu (Enterprise Style) */}
        <div
            className={\`
                fixed bottom-24 right-6 z-50 w-64 origin-bottom-right
                transition-all duration-200 ease-out
                \${isExpanded
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                }
            \`}
        >
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2 overflow-hidden">
                 {quickActions.length > 0 ? (
                     <div className="flex flex-col gap-1">
                         {quickActions.map((action, idx) => (
                             <button
                                key={idx}
                                onClick={() => {
                                    setIsExpanded(false);
                                    navigate(action.to);
                                }}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors w-full text-left"
                             >
                                 <span className="material-icons-round text-slate-500 dark:text-slate-400 text-[20px]">{action.icon}</span>
                                 <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{action.label}</span>
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

        {/* Flat Enterprise Bottom App Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe">
            <nav className="flex justify-around items-center h-[60px] max-w-md mx-auto px-4">
                <NavLink
                    to="/dashboard"
                    className={({isActive}) => \`flex flex-col items-center justify-center w-14 h-full transition-colors duration-200 \${isActive ? 'text-accent dark:text-accent-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}\`}
                >
                    <span className="material-icons-round text-[22px]">dashboard</span>
                    <span className="text-[10px] font-medium mt-1">Beranda</span>
                </NavLink>

                <NavLink
                    to="/activities"
                    className={({isActive}) => \`flex flex-col items-center justify-center w-14 h-full transition-colors duration-200 \${isActive ? 'text-accent dark:text-accent-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}\`}
                >
                    <span className="material-icons-round text-[22px]">event_note</span>
                    <span className="text-[10px] font-medium mt-1">Kegiatan</span>
                </NavLink>

                {/* FAB - Integrated into bar but distinct */}
                <div className="relative flex justify-center w-14 h-full items-center">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={\`
                            w-11 h-11 rounded-full flex items-center justify-center
                            shadow-sm transition-all duration-200 ease-out border border-transparent
                            \${isExpanded
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rotate-45 border-slate-300 dark:border-slate-600'
                                : 'bg-primary text-white hover:bg-slate-800 dark:bg-accent dark:hover:bg-accent-hover rotate-0'
                            }
                        \`}
                    >
                        <span className="material-icons-round text-[22px]">add</span>
                    </button>
                </div>

                {canViewFinance ? (
                    <NavLink
                        to="/finance"
                        className={({isActive}) => \`flex flex-col items-center justify-center w-14 h-full transition-colors duration-200 \${isActive ? 'text-accent dark:text-accent-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}\`}
                    >
                        <span className="material-icons-round text-[22px]">account_balance</span>
                        <span className="text-[10px] font-medium mt-1">Keuangan</span>
                    </NavLink>
                ) : (
                    <NavLink
                        to="/announcements"
                        className={({isActive}) => \`flex flex-col items-center justify-center w-14 h-full transition-colors duration-200 \${isActive ? 'text-accent dark:text-accent-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}\`}
                    >
                        <span className="material-icons-round text-[22px]">campaign</span>
                        <span className="text-[10px] font-medium mt-1">Info</span>
                    </NavLink>
                )}

                <NavLink
                    to="/profile"
                    className={({isActive}) => \`flex flex-col items-center justify-center w-14 h-full transition-colors duration-200 \${isActive ? 'text-accent dark:text-accent-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}\`}
                >
                    <span className="material-icons-round text-[22px]">person</span>
                    <span className="text-[10px] font-medium mt-1">Profil</span>
                </NavLink>

            </nav>
        </div>
    </>
  );
};

export default BottomNav;
`;

fs.writeFileSync('src/components/layout/BottomNav.jsx', bottomNavCode);
