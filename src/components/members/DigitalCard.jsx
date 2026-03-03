import React, { useMemo } from 'react';

const generateNIA = (uid) => {
    if (!uid) return 'KT-2024-000';
    // Generate a deterministic NIA based on UID (KT-YYYY-XXX)
    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
        hash = uid.charCodeAt(i) + ((hash << 5) - hash);
    }
    const num = Math.abs(hash) % 1000;
    const paddedNum = num.toString().padStart(3, '0');
    return `KT-2024-${paddedNum}`;
};

const DigitalCard = ({ member }) => {
  const uid = member?.uid || member?.id;
  const fullName = member?.fullName || member?.displayName || '__________________________';
  const memberId = member?.memberId || member?.nia || generateNIA(uid);
  const rawRole = member?.role || 'anggota';
  const role = rawRole.replace('_', ' ').toUpperCase();
  const address = member?.address || '________________________________';
  const validUntil = member?.validUntil || '__________________________';
  const photoUrl = member?.photoURL || null;
  const status = member?.status || 'active'; // Default active if legacy, pending if new

  // Logic: Is Pengurus? (Admin, Ketua, Wakil, Sekretaris, Bendahara, dsb)
  const isPengurus = ['super_admin', 'admin', 'ketua', 'wakil_ketua', 'sekretaris', 'bendahara', 'humas', 'content_creator'].includes(rawRole.toLowerCase());

  // Theme Colors based on Role - Red Maroon / Matte Black base as requested
  // Pengurus = Gold/Amber
  // Anggota = Cyan/Emerald
  const theme = isPengurus
    ? {
        gradientText: 'from-amber-300 via-yellow-200 to-orange-300',
        glowPrimary: 'bg-amber-500/20 group-hover:bg-amber-400/30',
        glowSecondary: 'bg-yellow-600/20 group-hover:bg-yellow-500/30',
        glowTertiary: 'bg-orange-500/20 group-hover:bg-orange-400/30',
        border1: 'border-amber-500/30',
        border2: 'border-orange-500/30',
        line1: 'via-yellow-500/20',
        line2: 'via-amber-500/20',
        textAccent: 'text-amber-400',
        textSub: 'text-amber-200',
        shadowAccent: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
        dropShadow: 'drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]',
        borderAccent: 'border-amber-400',
        scannerBeam: 'bg-amber-400/50 shadow-[0_0_8px_#facc15]'
      }
    : {
        gradientText: 'from-cyan-300 via-purple-300 to-emerald-300',
        glowPrimary: 'bg-cyan-500/20 group-hover:bg-cyan-400/30',
        glowSecondary: 'bg-purple-600/20 group-hover:bg-purple-500/30',
        glowTertiary: 'bg-emerald-500/20 group-hover:bg-emerald-400/30',
        border1: 'border-cyan-500/30',
        border2: 'border-emerald-500/30',
        line1: 'via-purple-500/20',
        line2: 'via-cyan-500/20',
        textAccent: 'text-cyan-400',
        textSub: 'text-purple-200',
        shadowAccent: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]',
        dropShadow: 'drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]',
        borderAccent: 'border-cyan-400',
        scannerBeam: 'bg-cyan-400/50 shadow-[0_0_8px_#22d3ee]'
      };

  // Logic: Is Expired?
  let isExpired = false;
  if (member?.validUntil && validUntil !== '__________________________') {
    const expiryDate = new Date(validUntil);
    if (!isNaN(expiryDate.getTime()) && expiryDate < new Date()) {
        isExpired = true;
    }
  }

  // Logic: QR Status Active?
  const isQrActive = status === 'active';

  // Generate Real QR URL pointing to the App's attendance page
  // Assuming the app is accessed from window.location.origin
  const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://karangtaruna.app';
  // Use HashRouter format because the app uses HashRouter (as seen in App.jsx)
  const scanUrl = `${appOrigin}/#/absen?nia=${memberId}&uid=${uid || ''}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(scanUrl)}&margin=0&color=0f172a&bgcolor=ffffff`;

  return (
    <div className="relative w-full max-w-[340px] aspect-[1/1.586] mx-auto rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-950 text-white font-sans font-display group perspective-1000">

        {/* Holographic Base Layers - Dark Matte / Maroon mix */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#110505] via-[#1f0b0b] to-slate-950 z-0"></div>

        {/* Animated Holographic Glows */}
        <div className={`absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[80px] transition-colors duration-700 ${theme.glowPrimary}`}></div>
        <div className={`absolute top-1/2 -right-32 w-64 h-64 rounded-full blur-[80px] transition-colors duration-700 ${theme.glowSecondary}`}></div>
        <div className={`absolute -bottom-32 left-1/4 w-64 h-64 rounded-full blur-[80px] transition-colors duration-700 ${theme.glowTertiary}`}></div>

        {/* Microtext Pattern Anti-Duplicate */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }}></div>
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 flex items-center justify-center overflow-hidden">
            <div className="text-[6px] tracking-widest text-white/50 w-[200%] text-center transform -rotate-45 leading-tight">
                KARANG TARUNA DIGITAL SYSTEM • KARANG TARUNA DIGITAL SYSTEM • KARANG TARUNA DIGITAL SYSTEM<br/>
                KARANG TARUNA DIGITAL SYSTEM • KARANG TARUNA DIGITAL SYSTEM • KARANG TARUNA DIGITAL SYSTEM<br/>
                KARANG TARUNA DIGITAL SYSTEM • KARANG TARUNA DIGITAL SYSTEM • KARANG TARUNA DIGITAL SYSTEM<br/>
                KARANG TARUNA DIGITAL SYSTEM • KARANG TARUNA DIGITAL SYSTEM • KARANG TARUNA DIGITAL SYSTEM<br/>
                KARANG TARUNA DIGITAL SYSTEM • KARANG TARUNA DIGITAL SYSTEM • KARANG TARUNA DIGITAL SYSTEM
            </div>
        </div>

        {/* Futuristic Geometric Lines */}
        <div className={`absolute top-0 right-0 w-32 h-32 border-t border-r rounded-tr-2xl opacity-50 ${theme.border1}`}></div>
        <div className={`absolute bottom-0 left-0 w-32 h-32 border-b border-l rounded-bl-2xl opacity-50 ${theme.border2}`}></div>
        <div className={`absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-transparent ${theme.line1}`}></div>
        <div className={`absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-transparent ${theme.line2}`}></div>

        {/* Large Transparent Watermark */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] z-0 flex items-center justify-center ${isPengurus ? 'text-amber-500' : ''}`}>
             <img src="/assets/logo.png" alt="Watermark" className="w-[200px] h-[200px] object-contain grayscale" onError={(e) => e.target.style.display='none'} />
        </div>

        {/* Glossy Reflection Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>

        {/* Card Content - Z-index elevated above backgrounds */}
        <div className="relative z-10 w-full h-full p-6 flex flex-col">

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className={`text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r ${theme.gradientText} ${theme.dropShadow}`}>
                        KARANG TARUNA
                    </h1>
                    <p className={`text-[8px] uppercase tracking-[0.2em] font-medium ${theme.textAccent}`}>
                        {isPengurus ? 'Executive Identity' : 'Smart Digital Identity'}
                    </p>
                </div>
                <div className={`w-8 h-8 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 flex items-center justify-center ${theme.shadowAccent} overflow-hidden`}>
                    <img src="/assets/logo.png" alt="Logo" className="w-6 h-6 object-contain" onError={(e) => e.target.style.display='none'} />
                </div>
            </div>

            {/* Middle: Photo & Info */}
            <div className="flex gap-4 mb-4 relative">
                {/* Photo Frame */}
                <div className="w-24 h-32 flex-shrink-0 rounded-lg bg-slate-800/50 backdrop-blur-md border border-white/10 relative overflow-hidden flex items-center justify-center group/photo shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent z-10 pointer-events-none"></div>

                    {/* Scanner Line Effect */}
                    <div className={`absolute top-0 left-0 w-full h-[2px] animate-[scan_3s_ease-in-out_infinite] z-20 opacity-0 group-hover/photo:opacity-100 transition-opacity ${theme.scannerBeam}`}></div>

                    {photoUrl ? (
                        <img src={photoUrl} alt="Member" className={`w-full h-full object-cover relative z-0 ${!isQrActive ? 'grayscale' : ''}`} />
                    ) : (
                        <span className="material-icons-round text-slate-600 text-4xl relative z-0">person_outline</span>
                    )}

                    {/* Frame corner accents */}
                    <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${theme.borderAccent}`}></div>
                    <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${theme.borderAccent}`}></div>
                    <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${theme.borderAccent}`}></div>
                    <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${theme.borderAccent}`}></div>

                    {/* Expired Badge on Photo */}
                    {isExpired && (
                        <div className="absolute bottom-0 left-0 right-0 bg-red-600/90 backdrop-blur-sm text-white text-[8px] font-bold text-center py-1 z-30 uppercase tracking-widest">
                            Expired
                        </div>
                    )}
                </div>

                {/* Info Fields */}
                <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                    <div className="mb-2">
                        <p className="text-[7px] text-slate-400 uppercase tracking-wider mb-0.5 font-semibold">Nama Lengkap</p>
                        <p className="text-[11px] font-bold text-white truncate drop-shadow-md">{fullName}</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-[7px] text-slate-400 uppercase tracking-wider mb-0.5 font-semibold">NIA</p>
                        <p className={`text-[10px] font-mono tracking-wider drop-shadow-md ${isPengurus ? 'text-amber-100' : 'text-cyan-100'}`}>{memberId}</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-[7px] text-slate-400 uppercase tracking-wider mb-0.5 font-semibold">Jabatan</p>
                        <p className={`text-[10px] uppercase font-bold drop-shadow-md ${theme.textSub}`}>{role}</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-[7px] text-slate-400 uppercase tracking-wider mb-0.5 font-semibold">Status</p>
                        <p className={`text-[9px] uppercase font-bold drop-shadow-md ${isQrActive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isQrActive ? 'Aktif' : 'Non-Aktif'}
                        </p>
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
                    <div className="flex items-center gap-2">
                        <p className={`text-[10px] font-mono tracking-wider ${isExpired ? 'text-red-400' : (isPengurus ? 'text-amber-300' : 'text-emerald-300')}`}>
                            {validUntil}
                        </p>
                        {isExpired && (
                            <span className="px-1.5 py-0.5 bg-red-500/20 border border-red-500 rounded text-[6px] text-red-400 font-bold uppercase">
                                Tidak Berlaku
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom: QR, Signatures, NFC */}
            <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-4">

                {/* QR Code Area */}
                <div className="flex flex-col items-center relative">
                    <div className={`w-14 h-14 bg-white rounded-md p-1 mb-1 relative overflow-hidden group/qr ${!isQrActive ? 'opacity-50' : ''}`}>
                         {isQrActive && !isExpired ? (
                             <img src={qrImageUrl} alt="QR Code Absen" className="w-full h-full object-cover mix-blend-multiply" />
                         ) : (
                             <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0IDQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMiIgeT0iMSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjEiIHk9IjIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIi8+PC9zdmc+')] bg-repeat opacity-80" style={{ backgroundSize: '4px 4px' }}></div>
                         )}

                        {/* Scanning beam (only if active) */}
                        {isQrActive && !isExpired && (
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-red-500 shadow-[0_0_5px_#ef4444] animate-[scan_2s_linear_infinite] opacity-0 group-hover/qr:opacity-100"></div>
                        )}
                    </div>

                    {/* Inactive Label Overlay */}
                    {(!isQrActive || isExpired) && (
                        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-full text-center transform -rotate-12 bg-red-600 border border-red-400 text-white text-[7px] font-black uppercase tracking-widest px-1 py-0.5 shadow-lg z-10">
                            {isExpired ? 'Expired' : 'Belum Aktif'}
                        </div>
                    )}

                    <p className={`text-[5px] text-center leading-tight uppercase font-bold tracking-widest w-16 ${isQrActive && !isExpired ? 'text-slate-400' : 'text-red-400'}`}>
                        {isQrActive && !isExpired ? 'Scan Untuk Absen Kehadiran' : 'QR TIDAK AKTIF'}
                    </p>
                </div>

                {/* Signatures & Stamp */}
                <div className="flex-1 px-4 flex justify-center items-center relative h-16">
                     {/* Stamp Placeholder */}
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                         <div className={`w-12 h-12 rounded-full border border-dashed flex items-center justify-center transform -rotate-15 ${isPengurus ? 'border-amber-500' : 'border-cyan-500'}`}>
                             <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-[5px] font-bold uppercase tracking-tighter text-center leading-none ${isPengurus ? 'border-amber-500/50 text-amber-500' : 'border-cyan-500/50 text-cyan-500'}`}>
                                 Valid<br/>Official
                             </div>
                         </div>
                     </div>

                     {/* Signature Line */}
                     <div className="w-16 flex flex-col items-center z-10">
                         <div className="h-6 w-full flex items-end justify-center mb-1">
                              {/* Signature squiggle placeholder */}
                              <svg viewBox="0 0 100 30" className={`w-full h-full opacity-60 fill-none ${isPengurus ? 'stroke-amber-400' : 'stroke-emerald-400'}`} strokeWidth="2" strokeLinecap="round">
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
                        <span className={`material-icons-round text-[10px] ${theme.textAccent}`}>contactless</span>
                        <span className={`text-[6px] font-mono tracking-widest ${theme.textAccent}`}>NFC</span>
                    </div>
                    <div className="text-right">
                         <div className={`inline-block px-1.5 py-0.5 border rounded flex items-center gap-0.5 mb-1 ${
                             isQrActive && !isExpired
                                ? (isPengurus ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400')
                                : 'bg-red-500/20 border-red-500/50 text-red-400'
                         }`}>
                             <span className="material-icons-round text-[8px]">{isQrActive && !isExpired ? 'verified' : 'gpp_bad'}</span>
                             <span className="text-[5px] uppercase font-bold tracking-widest">
                                 {isQrActive && !isExpired ? 'Digital Valid' : 'Invalid'}
                             </span>
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
