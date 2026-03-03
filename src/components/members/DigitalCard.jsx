import React from 'react';

const DigitalCard = ({ member }) => {
  // Default placeholders if data is not provided
  const fullName = member?.fullName || '__________________________';
  const memberId = member?.memberId || '___________________';
  const role = member?.role ? member.role.replace('_', ' ').toUpperCase() : '_______________________________';
  const address = member?.address || '________________________________';
  const validUntil = member?.validUntil || '__________________________';
  const photoUrl = member?.photoURL || null;

  return (
    <div className="relative w-full max-w-[340px] aspect-[1/1.586] mx-auto rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-950 text-white font-sans font-display group perspective-1000">

        {/* Holographic Base Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 z-0"></div>

        {/* Animated Holographic Glows */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] group-hover:bg-cyan-400/30 transition-colors duration-700"></div>
        <div className="absolute top-1/2 -right-32 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] group-hover:bg-purple-500/30 transition-colors duration-700"></div>
        <div className="absolute -bottom-32 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] group-hover:bg-emerald-400/30 transition-colors duration-700"></div>

        {/* Microtext Pattern Anti-Duplicate */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }}></div>
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 flex items-center justify-center overflow-hidden">
            <div className="text-[6px] tracking-widest text-white/50 w-[200%] text-center transform -rotate-45 leading-tight">
                KARTEJI SECURE ID VALIDATION SYSTEM • KARTEJI SECURE ID VALIDATION SYSTEM • KARTEJI SECURE ID VALIDATION SYSTEM<br/>
                KARTEJI SECURE ID VALIDATION SYSTEM • KARTEJI SECURE ID VALIDATION SYSTEM • KARTEJI SECURE ID VALIDATION SYSTEM<br/>
                KARTEJI SECURE ID VALIDATION SYSTEM • KARTEJI SECURE ID VALIDATION SYSTEM • KARTEJI SECURE ID VALIDATION SYSTEM<br/>
                KARTEJI SECURE ID VALIDATION SYSTEM • KARTEJI SECURE ID VALIDATION SYSTEM • KARTEJI SECURE ID VALIDATION SYSTEM<br/>
                KARTEJI SECURE ID VALIDATION SYSTEM • KARTEJI SECURE ID VALIDATION SYSTEM • KARTEJI SECURE ID VALIDATION SYSTEM
            </div>
        </div>

        {/* Futuristic Geometric Lines */}
        <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-cyan-500/30 rounded-tr-2xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-emerald-500/30 rounded-bl-2xl opacity-50"></div>
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>

        {/* Large Transparent Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] z-0 flex items-center justify-center">
             <span className="material-icons-round text-[200px]">verified_user</span>
        </div>

        {/* Glossy Reflection Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>

        {/* Card Content - Z-index elevated above backgrounds */}
        <div className="relative z-10 w-full h-full p-6 flex flex-col">

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-purple-300 to-emerald-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                        KARTEJI
                    </h1>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-cyan-400 font-medium">Smart Digital Identity</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <span className="material-icons-round text-purple-400 text-xl">admin_panel_settings</span>
                </div>
            </div>

            {/* Middle: Photo & Info */}
            <div className="flex gap-4 mb-4 relative">
                {/* Photo Frame */}
                <div className="w-24 h-32 flex-shrink-0 rounded-lg bg-slate-800/50 backdrop-blur-md border border-white/10 relative overflow-hidden flex items-center justify-center group/photo">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent z-10 pointer-events-none"></div>
                    {/* Scanner Line Effect */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/50 shadow-[0_0_8px_#22d3ee] animate-[scan_3s_ease-in-out_infinite] z-20 opacity-0 group-hover/photo:opacity-100 transition-opacity"></div>

                    {photoUrl ? (
                        <img src={photoUrl} alt="Member" className="w-full h-full object-cover relative z-0" />
                    ) : (
                        <span className="material-icons-round text-slate-600 text-4xl relative z-0">person_outline</span>
                    )}

                    {/* Frame corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400"></div>
                </div>

                {/* Info Fields */}
                <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                    <div className="mb-2">
                        <p className="text-[7px] text-slate-400 uppercase tracking-wider mb-0.5 font-semibold">Nama Lengkap</p>
                        <p className="text-[11px] font-bold text-white truncate drop-shadow-md">{fullName}</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-[7px] text-slate-400 uppercase tracking-wider mb-0.5 font-semibold">NIA</p>
                        <p className="text-[10px] text-cyan-100 font-mono tracking-wider drop-shadow-md">{memberId}</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-[7px] text-slate-400 uppercase tracking-wider mb-0.5 font-semibold">Jabatan</p>
                        <p className="text-[10px] text-purple-200 uppercase font-medium drop-shadow-md">{role}</p>
                    </div>
                </div>
            </div>

            {/* Extended Info */}
            <div className="mb-4">
                 <div className="mb-2">
                    <p className="text-[7px] text-slate-400 uppercase tracking-wider mb-0.5 font-semibold">Alamat</p>
                    <p className="text-[9px] text-slate-300 line-clamp-2 leading-tight">{address}</p>
                </div>
                 <div>
                    <p className="text-[7px] text-slate-400 uppercase tracking-wider mb-0.5 font-semibold">Masa Berlaku</p>
                    <p className="text-[10px] text-emerald-300 font-mono tracking-wider">{validUntil}</p>
                </div>
            </div>

            {/* Bottom: QR, Signatures, NFC */}
            <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-4">

                {/* QR Code Area */}
                <div className="flex flex-col items-center">
                    <div className="w-14 h-14 bg-white rounded-md p-1 mb-1 relative overflow-hidden group/qr">
                         {/* Fake QR Pattern */}
                        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0IDQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMiIgeT0iMSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjEiIHk9IjIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIi8+PC9zdmc+')] bg-repeat opacity-80" style={{ backgroundSize: '4px 4px' }}></div>

                        {/* Scanning beam */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-red-500 shadow-[0_0_5px_#ef4444] animate-[scan_2s_linear_infinite] opacity-0 group-hover/qr:opacity-100"></div>
                    </div>
                    <p className="text-[5px] text-center text-slate-400 leading-tight uppercase font-bold tracking-widest w-16">Scan Untuk<br/>Absen Kehadiran</p>
                </div>

                {/* Signatures & Stamp */}
                <div className="flex-1 px-4 flex justify-center items-center relative h-16">
                     {/* Stamp Placeholder */}
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                         <div className="w-12 h-12 rounded-full border border-dashed border-cyan-500 flex items-center justify-center transform -rotate-15">
                             <div className="w-10 h-10 rounded-full border border-cyan-500/50 flex items-center justify-center text-[5px] text-cyan-500 font-bold uppercase tracking-tighter text-center leading-none">
                                 Valid<br/>Official
                             </div>
                         </div>
                     </div>

                     {/* Signature Line */}
                     <div className="w-16 flex flex-col items-center z-10">
                         <div className="h-6 w-full flex items-end justify-center mb-1">
                              {/* Signature squiggle placeholder */}
                              <svg viewBox="0 0 100 30" className="w-full h-full opacity-60 stroke-emerald-400 fill-none" strokeWidth="2" strokeLinecap="round">
                                  <path d="M10,20 Q20,5 30,20 T50,20 T70,10 T90,25" />
                              </svg>
                         </div>
                         <div className="w-full h-[1px] bg-slate-600"></div>
                         <p className="text-[5px] text-slate-400 uppercase mt-1 tracking-wider">Ketua Umum</p>
                     </div>
                </div>

                {/* NFC & Secure Badge */}
                <div className="flex flex-col items-end justify-between h-[72px]">
                    <div className="flex items-center gap-1 opacity-70">
                        <span className="material-icons-round text-cyan-400 text-[10px]">contactless</span>
                        <span className="text-[6px] text-cyan-400 font-mono tracking-widest">NFC</span>
                    </div>
                    <div className="text-right">
                         <div className="inline-block px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/50 rounded flex items-center gap-0.5 mb-1">
                             <span className="material-icons-round text-emerald-400 text-[8px]">verified</span>
                             <span className="text-[5px] text-emerald-400 uppercase font-bold tracking-widest">Digital Valid</span>
                         </div>
                         <p className="text-[5px] text-slate-500">Validasi Digital Resmi</p>
                    </div>
                </div>

            </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
            @keyframes scan {
                0% { transform: translateY(-10px); }
                50% { transform: translateY(120px); }
                100% { transform: translateY(-10px); }
            }
        `}} />
    </div>
  );
};

export default DigitalCard;
