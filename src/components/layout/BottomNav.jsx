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
        bg: "bg-blue-500",
        allowed: ['super_admin', 'ketua', 'sekretaris', 'content_creator']
    },
    {
        to: "/announcements/create",
        icon: "campaign",
        label: "Info",
        bg: "bg-orange-500",
        allowed: ['super_admin', 'ketua', 'sekretaris', 'humas', 'content_creator']
    },
    {
        to: "/finance/add",
        icon: "receipt_long",
        label: "Transaksi",
        bg: "bg-emerald-500",
        allowed: ['super_admin', 'bendahara', 'ketua']
    },
    {
        to: "/gallery/add",
        icon: "add_photo_alternate",
        label: "Galeri",
        bg: "bg-purple-500",
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
        {/* Overlay for Expanded Menu */}
        {isExpanded && (
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 animate-fade-in"
                onClick={() => setIsExpanded(false)}
            />
        )}

        {/* Floating Quick Action Menu (Morphing Container) */}
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
             <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-5">
                 {quickActions.length > 0 ? (
                     <div className="grid grid-cols-2 gap-4">
                         {quickActions.map((action, idx) => (
                             <button
                                key={idx}
                                onClick={() => {
                                    setIsExpanded(false);
                                    navigate(action.to);
                                }}
                                className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
                             >
                                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-200 dark:shadow-none transition-transform group-hover:-translate-y-1 ${action.bg}`}>
                                     <span className="material-icons-round text-2xl">{action.icon}</span>
                                 </div>
                                 <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 tracking-wide">{action.label}</span>
                             </button>
                         ))}
                     </div>
                 ) : (
                     <div className="text-center py-4">
                         <span className="material-icons-round text-gray-300 text-4xl mb-2">block</span>
                         <p className="text-xs text-gray-400 font-medium">Tidak ada aksi cepat tersedia untuk peran Anda.</p>
                     </div>
                 )}
             </div>
        </div>

        {/* Floating Bottom App Bar */}
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pb-safe pointer-events-none">
            <nav
                className={`
                    relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl
                    rounded-[28px] h-[72px] flex items-center justify-between w-full max-w-sm px-2
                    shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                    border border-white/20 dark:border-gray-800/50 pointer-events-auto
                    transition-all duration-300
                `}
            >
                {/* Left Side */}
                <div className="flex flex-1 justify-around items-center h-full">
                    <NavLink
                        to="/dashboard"
                        className={({isActive}) => `flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${isActive ? 'text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        <span className="material-icons-round text-[24px]">home</span>
                    </NavLink>

                    <NavLink
                        to="/activities"
                        className={({isActive}) => `flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${isActive ? 'text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
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
                            shadow-[0_8px_20px_rgba(37,99,235,0.4)] dark:shadow-[0_8px_20px_rgba(59,130,246,0.4)]
                            transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
                            border-[4px] border-gray-50 dark:border-gray-900
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
                            className={({isActive}) => `flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${isActive ? 'text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            <span className="material-icons-round text-[24px]">account_balance_wallet</span>
                        </NavLink>
                    ) : (
                        <NavLink
                            to="/announcements"
                            className={({isActive}) => `flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${isActive ? 'text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            <span className="material-icons-round text-[24px]">campaign</span>
                        </NavLink>
                    )}

                    <NavLink
                        to="/profile"
                        className={({isActive}) => `flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${isActive ? 'text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
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
