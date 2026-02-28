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
        bg: "bg-blue-600", // Darker for contrast
        allowed: ['super_admin', 'ketua', 'sekretaris', 'content_creator']
    },
    {
        to: "/announcements/create",
        icon: "campaign",
        label: "Info",
        bg: "bg-orange-600",
        allowed: ['super_admin', 'ketua', 'sekretaris', 'humas', 'content_creator']
    },
    {
        to: "/finance/add",
        icon: "receipt_long",
        label: "Transaksi",
        bg: "bg-emerald-600",
        allowed: ['super_admin', 'bendahara', 'ketua']
    },
    {
        to: "/gallery/add",
        icon: "add_photo_alternate",
        label: "Galeri",
        bg: "bg-purple-600",
        allowed: ['super_admin', 'content_creator', 'sekretaris']
    },
  ];

  // Filter actions the user can actually perform
  const quickActions = allActions.filter(action =>
    action.allowed.includes(userRole)
  );

  // Hide BottomNav on Auth pages or standalone pages
  if (['/', '/register', '/login'].includes(location.pathname)) return null;

  return (
    <>
        {/* Overlay for Expanded Menu with blur */}
        <div
            className={`
                fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300 ease-ios
                ${isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
            onClick={() => setIsExpanded(false)}
        />

        {/* Floating Quick Action Menu (Glassmorphism & Scale In) */}
        <div
            className={`
                fixed bottom-28 left-1/2 -translate-x-1/2 z-50 w-[280px]
                transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) origin-bottom
                ${isExpanded
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-75 translate-y-12 pointer-events-none'
                }
            `}
        >
             <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-glass border border-white/40 dark:border-white/10 p-5">
                 {quickActions.length > 0 ? (
                     <div className="grid grid-cols-2 gap-4">
                         {quickActions.map((action, idx) => (
                             <button
                                key={idx}
                                onClick={() => {
                                    setIsExpanded(false);
                                    navigate(action.to);
                                }}
                                className="flex flex-col items-center gap-2 group active:scale-95 transition-transform duration-300 ease-ios"
                             >
                                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-200/50 dark:shadow-none transition-transform group-hover:-translate-y-1 ${action.bg}`}>
                                     <span className="material-icons-round text-2xl">{action.icon}</span>
                                 </div>
                                 <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200 tracking-wide">{action.label}</span>
                             </button>
                         ))}
                     </div>
                 ) : (
                     <div className="text-center py-4">
                         <span className="material-icons-round text-gray-400 text-4xl mb-2">block</span>
                         <p className="text-xs text-gray-500 font-medium">Tidak ada aksi cepat tersedia.</p>
                     </div>
                 )}
             </div>
        </div>

        {/* Floating Bottom App Bar with Glassmorphism */}
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pb-safe pointer-events-none">
            <nav
                className={`
                    relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
                    rounded-[28px] h-[72px] flex items-center justify-between w-full max-w-sm px-2
                    shadow-glass border border-white/20 dark:border-white/10 pointer-events-auto
                    transition-all duration-300 ease-ios
                `}
            >
                {/* Left Side */}
                <div className="flex flex-1 justify-around items-center h-full">
                    <NavLink
                        to="/dashboard"
                        className={({isActive}) => `flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ease-ios ${isActive ? 'text-primary dark:text-blue-400 bg-white/50 dark:bg-white/5 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        <span className="material-icons-round text-[24px]">home</span>
                    </NavLink>

                    <NavLink
                        to="/activities"
                        className={({isActive}) => `flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ease-ios ${isActive ? 'text-primary dark:text-blue-400 bg-white/50 dark:bg-white/5 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        <span className="material-icons-round text-[24px]">event_note</span>
                    </NavLink>
                </div>

                {/* FAB Container - Absolute Center */}
                <div className="relative -top-8 w-16 h-16 mx-2 flex-shrink-0 z-20">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`
                            absolute inset-0 w-full h-full rounded-[24px] flex items-center justify-center
                            shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20
                            transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
                            border-[4px] border-gray-50/50 dark:border-gray-900/50 backdrop-blur-md
                            ${isExpanded
                                ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900 rotate-[135deg] scale-90'
                                : 'bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rotate-0 hover:scale-105 active:scale-95'
                            }
                        `}
                    >
                        <span className="material-icons-round text-3xl">add</span>
                    </button>
                </div>

                {/* Right Side */}
                <div className="flex flex-1 justify-around items-center h-full">
                    {canViewFinance ? (
                        <NavLink
                            to="/finance"
                            className={({isActive}) => `flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ease-ios ${isActive ? 'text-primary dark:text-blue-400 bg-white/50 dark:bg-white/5 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            <span className="material-icons-round text-[24px]">account_balance_wallet</span>
                        </NavLink>
                    ) : (
                        <NavLink
                            to="/announcements"
                            className={({isActive}) => `flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ease-ios ${isActive ? 'text-primary dark:text-blue-400 bg-white/50 dark:bg-white/5 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            <span className="material-icons-round text-[24px]">campaign</span>
                        </NavLink>
                    )}

                    <NavLink
                        to="/profile"
                        className={({isActive}) => `flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ease-ios ${isActive ? 'text-primary dark:text-blue-400 bg-white/50 dark:bg-white/5 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        <span className="material-icons-round text-[24px]">person</span>
                    </NavLink>
                </div>

            </nav>
        </div>
    </>
  );
};

export default BottomNav;
