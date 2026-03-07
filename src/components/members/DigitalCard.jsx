import React from 'react';

const generateNIA = (uid, joinDate) => {
    if (!uid) return 'KT-2024-000';
    let year = '2024';
    if (joinDate) {
        try {
            year = new Date(joinDate).getFullYear().toString();
        } catch(e) {}
    }
    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
        hash = uid.charCodeAt(i) + ((hash << 5) - hash);
    }
    const num = Math.abs(hash) % 1000;
    const paddedNum = num.toString().padStart(3, '0');
    return `KT-${year}-${paddedNum}`;
};

const DigitalCard = ({ member }) => {
  const uid = member?.uid || member?.id;
  const fullName = member?.fullName || member?.displayName || '__________________________';
  const rawRole = member?.role || 'anggota';
  const role = rawRole.replace('_', ' ').toUpperCase();
  const joinDate = member?.createdAt?.toDate ? member.createdAt.toDate().toLocaleDateString('id-ID') : (member?.createdAt || '________________');
  const memberId = member?.memberId || member?.nia || generateNIA(uid, member?.createdAt);
  const photoUrl = member?.photoURL || null;
  const status = member?.status || 'active';

  const isPengurus = ['super_admin', 'admin', 'ketua', 'wakil_ketua', 'sekretaris', 'bendahara', 'humas', 'content_creator'].includes(rawRole.toLowerCase());

  const theme = isPengurus
    ? {
        gradientText: 'from-amber-300 via-yellow-200 to-orange-300',
        glowPrimary: 'bg-amber-500/20 group-hover:bg-amber-400/30',
        glowSecondary: 'bg-yellow-600/20 group-hover:bg-yellow-500/30',
        glowTertiary: 'bg-orange-500/20 group-hover:bg-orange-400/30',
        borderAccent: 'border-amber-400',
        textAccent: 'text-amber-400',
      }
    : {
        gradientText: 'from-cyan-300 via-purple-300 to-emerald-300',
        glowPrimary: 'bg-cyan-500/20 group-hover:bg-cyan-400/30',
        glowSecondary: 'bg-purple-600/20 group-hover:bg-purple-500/30',
        glowTertiary: 'bg-emerald-500/20 group-hover:bg-emerald-400/30',
        borderAccent: 'border-cyan-400',
        textAccent: 'text-cyan-400',
      };

  const isQrActive = status === 'active';
  const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://karangtaruna.app';
  // Link QR code to member's detail page for admins to verify
  const profileUrl = `${appOrigin}/#/members/${uid || ''}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(profileUrl)}&margin=0&color=0f172a&bgcolor=ffffff`;

  return (
    <div className="relative w-full max-w-[340px] aspect-[1/1.586] mx-auto rounded-2xl overflow-hidden shadow-2xl bg-slate-950 text-white font-sans font-display group perspective-1000 border border-white/10">

        <div className="absolute inset-0 bg-gradient-to-br from-[#110505] via-[#1f0b0b] to-slate-950 z-0"></div>
        <div className={`absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[80px] transition-colors duration-700 ${theme.glowPrimary}`}></div>
        <div className={`absolute top-1/2 -right-32 w-64 h-64 rounded-full blur-[80px] transition-colors duration-700 ${theme.glowSecondary}`}></div>
        <div className={`absolute -bottom-32 left-1/4 w-64 h-64 rounded-full blur-[80px] transition-colors duration-700 ${theme.glowTertiary}`}></div>

        <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 flex items-center justify-center overflow-hidden">
            <div className="text-[6px] tracking-widest text-white/50 w-[200%] text-center transform -rotate-45 leading-tight">
                KARANG TARUNA DIGITAL SYSTEM • KARANG TARUNA DIGITAL SYSTEM<br/>
                KARANG TARUNA DIGITAL SYSTEM • KARANG TARUNA DIGITAL SYSTEM<br/>
                KARANG TARUNA DIGITAL SYSTEM • KARANG TARUNA DIGITAL SYSTEM<br/>
                KARANG TARUNA DIGITAL SYSTEM • KARANG TARUNA DIGITAL SYSTEM
            </div>
        </div>

        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] z-0 flex items-center justify-center ${isPengurus ? 'text-amber-500' : ''}`}>
             <img src="/assets/logo.png" alt="Watermark" className="w-[200px] h-[200px] object-contain grayscale" onError={(e) => e.target.style.display='none'} />
        </div>

        <div className="relative z-10 w-full h-full p-6 flex flex-col">

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className={`text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r ${theme.gradientText}`}>
                        KARANG TARUNA
                    </h1>
                    <p className={`text-[8px] uppercase tracking-[0.2em] font-medium ${theme.textAccent}`}>
                        {isPengurus ? 'Executive Identity' : 'Official Member Card'}
                    </p>
                </div>
                <div className={`w-8 h-8 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden`}>
                    <img src="/assets/logo.png" alt="Logo" className="w-6 h-6 object-contain" onError={(e) => e.target.style.display='none'} />
                </div>
            </div>

            <div className="flex gap-4 mb-4 relative">
                <div className="w-24 h-32 flex-shrink-0 rounded-lg bg-slate-800/50 backdrop-blur-md border border-white/10 relative overflow-hidden flex items-center justify-center group/photo shadow-lg">
                    {photoUrl ? (
                        <img src={photoUrl} alt="Member" className={`w-full h-full object-cover relative z-0 ${!isQrActive ? 'grayscale' : ''}`} />
                    ) : (
                        <span className="material-icons-round text-slate-600 text-4xl relative z-0">person_outline</span>
                    )}

                    <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${theme.borderAccent}`}></div>
                    <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${theme.borderAccent}`}></div>
                    <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${theme.borderAccent}`}></div>
                    <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${theme.borderAccent}`}></div>
                </div>

                <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                    <div className="mb-2">
                        <p className="text-[7px] text-slate-400 uppercase tracking-wider mb-0.5 font-semibold">Nama Anggota</p>
                        <p className="text-[11px] font-bold text-white truncate drop-shadow-md">{fullName}</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-[7px] text-slate-400 uppercase tracking-wider mb-0.5 font-semibold">NIA</p>
                        <p className={`text-[10px] font-mono tracking-wider drop-shadow-md ${isPengurus ? 'text-amber-100' : 'text-cyan-100'}`}>{memberId}</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-[7px] text-slate-400 uppercase tracking-wider mb-0.5 font-semibold">Peran</p>
                        <p className={`text-[10px] uppercase font-bold drop-shadow-md ${theme.textAccent}`}>{role}</p>
                    </div>
                </div>
            </div>

            <div className="mb-4 flex gap-4">
                 <div className="flex-1">
                    <p className="text-[7px] text-slate-400 uppercase tracking-wider mb-0.5 font-semibold">Tanggal Bergabung</p>
                    <p className="text-[9px] text-slate-300 leading-tight">{joinDate}</p>
                </div>
                 <div className="flex-1">
                    <p className="text-[7px] text-slate-400 uppercase tracking-wider mb-0.5 font-semibold">Status Keanggotaan</p>
                    <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${isQrActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        <p className={`text-[9px] uppercase font-bold drop-shadow-md ${isQrActive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isQrActive ? 'Aktif' : 'Non-Aktif'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-4">
                <div className="flex flex-col items-center relative">
                    <div className={`w-14 h-14 bg-white rounded-md p-1 mb-1 relative overflow-hidden group/qr ${!isQrActive ? 'opacity-50' : ''}`}>
                         {isQrActive ? (
                             <img src={qrImageUrl} alt="QR Code Member" className="w-full h-full object-cover mix-blend-multiply" />
                         ) : (
                             <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0IDQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMiIgeT0iMSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjEiIHk9IjIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIi8+PC9zdmc+')] bg-repeat opacity-80" style={{ backgroundSize: '4px 4px' }}></div>
                         )}
                    </div>

                    {!isQrActive && (
                        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-full text-center transform -rotate-12 bg-red-600 border border-red-400 text-white text-[7px] font-black uppercase tracking-widest px-1 py-0.5 shadow-lg z-10">
                            Belum Aktif
                        </div>
                    )}

                    <p className={`text-[5px] text-center leading-tight uppercase font-bold tracking-widest w-16 ${isQrActive ? 'text-slate-400' : 'text-red-400'}`}>
                        {isQrActive ? 'Scan QR Validasi' : 'TIDAK AKTIF'}
                    </p>
                </div>

                <div className="flex-1 px-4 flex justify-center items-center relative h-16">
                     <div className="w-16 flex flex-col items-center z-10">
                         <div className="h-6 w-full flex items-end justify-center mb-1">
                              <svg viewBox="0 0 100 30" className={`w-full h-full opacity-60 fill-none ${isPengurus ? 'stroke-amber-400' : 'stroke-emerald-400'}`} strokeWidth="2" strokeLinecap="round">
                                  <path d="M10,20 Q20,5 30,20 T50,20 T70,10 T90,25" />
                              </svg>
                         </div>
                         <div className="w-full h-[1px] bg-slate-600"></div>
                         <p className="text-[5px] text-slate-400 uppercase mt-1 tracking-wider">Ketua Umum</p>
                     </div>
                </div>

                <div className="flex flex-col items-end justify-between h-[72px]">
                    <div className="text-right mt-auto">
                         <div className={`inline-block px-1.5 py-0.5 border rounded flex items-center gap-0.5 mb-1 ${
                             isQrActive
                                ? (isPengurus ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400')
                                : 'bg-red-500/20 border-red-500/50 text-red-400'
                         }`}>
                             <span className="material-icons-round text-[8px]">{isQrActive ? 'verified' : 'gpp_bad'}</span>
                             <span className="text-[5px] uppercase font-bold tracking-widest">
                                 {isQrActive ? 'Verified ID' : 'Invalid'}
                             </span>
                         </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default DigitalCard;
