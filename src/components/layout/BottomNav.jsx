import React, { useState } from 'react';
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

  // Active state styling helper
  const getNavClass = (isActive) => `
    relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ease-out
    ${isActive
        ? 'text-primary bg-primary/10 dark:bg-primary/20 scale-105'
        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}
  `;

  return (
    <React.Fragment>
        {/* Overlay for Expanded Menu */}
        <div
            className={`
                fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300
                ${isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
            onClick={() => setIsExpanded(false)}
        />

        {/* Floating Quick Action Menu (Glassmorphism) */}
        <div
            className={`
                fixed bottom-28 left-1/2 -translate-x-1/2 z-50 w-64 origin-bottom
                transition-all duration-300 ease-out
                ${isExpanded
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-8 pointer-events-none'
                }
            `}
        >
             <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-2 overflow-hidden">
                 {quickActions.length > 0 ? (
                     <div className="flex flex-col gap-1">
                         {quickActions.map((action, idx) => (
                             <button
                                key={idx}
                                onClick={() => {
                                    setIsExpanded(false);
                                    navigate(action.to);
                                }}
                                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors w-full text-left group"
                             >
                                 <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                     <span className="material-icons-round text-[20px]">{action.icon}</span>
                                 </div>
                                 <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{action.label}</span>
                             </button>
                         ))}
                     </div>
                 ) : (
                     <div className="text-center py-6">
                         <span className="material-icons-round text-slate-300 dark:text-slate-600 text-4xl mb-2">lock</span>
                         <p className="text-xs text-slate-500 font-medium">Akses Tambah Data Dibatasi</p>
                     </div>
                 )}
             </div>
        </div>

        {/* Liquid Glass Bottom Navigation */}
        <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pb-safe px-4 pointer-events-none">
            <nav className="pointer-events-auto w-full max-w-[380px] h-[72px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-full shadow-lg border border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center px-3 relative">

                {/* Left side links */}
                <div className="flex flex-1 justify-around items-center h-full">
                    <NavLink to="/dashboard" className={({isActive}) => getNavClass(isActive)}>
                        <span className="material-icons-round text-[24px]">dashboard</span>
                        <span className="text-[10px] font-medium mt-0.5 tracking-wide">Beranda</span>
                    </NavLink>

                    <NavLink to="/activities" className={({isActive}) => getNavClass(isActive)}>
                        <span className="material-icons-round text-[24px]">event_note</span>
                        <span className="text-[10px] font-medium mt-0.5 tracking-wide">Kegiatan</span>
                    </NavLink>
                </div>

                {/* FAB - Morphing Liquid Center */}
                <div className="relative flex justify-center items-center w-20 h-20 -mt-8">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`
                            w-14 h-14 rounded-full flex items-center justify-center
                            shadow-xl transition-all duration-300 ease-out backdrop-blur-md border-4 border-white dark:border-slate-900
                            ${isExpanded
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rotate-45 scale-95'
                                : 'bg-primary text-white hover:scale-105 active:scale-95'
                            }
                        `}
                    >
                        <span className="material-icons-round text-[26px]">add</span>
                    </button>
                </div>

                {/* Right side links */}
                <div className="flex flex-1 justify-around items-center h-full">
                    {canViewFinance ? (
                        <NavLink to="/finance" className={({isActive}) => getNavClass(isActive)}>
                            <span className="material-icons-round text-[24px]">account_balance_wallet</span>
                            <span className="text-[10px] font-medium mt-0.5 tracking-wide">Keuangan</span>
                        </NavLink>
                    ) : (
                        <NavLink to="/announcements" className={({isActive}) => getNavClass(isActive)}>
                            <div className="relative">
                                <span className="material-icons-round text-[24px]">campaign</span>
                                {/* Notification Badge */}
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                            </div>
                            <span className="text-[10px] font-medium mt-0.5 tracking-wide">Info</span>
                        </NavLink>
                    )}

                    <NavLink to="/profile" className={({isActive}) => getNavClass(isActive)}>
                        <span className="material-icons-round text-[24px]">person</span>
                        <span className="text-[10px] font-medium mt-0.5 tracking-wide">Profil</span>
                    </NavLink>
                </div>

            </nav>
        </div>
    </React.Fragment>
  );
};

export default BottomNav;
