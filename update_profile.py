import re

with open('src/pages/Profile.jsx', 'r') as f:
    content = f.read()

old_header = """      <div className="bg-indigo-600 dark:bg-slate-800 pt-12 pb-24 px-6 text-center text-white relative">
        <div className="absolute top-4 right-4 flex gap-2">
           <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <span className="material-icons-round">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
           </button>
        </div>

        <div className="w-24 h-24 mx-auto rounded-full bg-indigo-200 dark:bg-slate-700 p-1 mb-4 relative overflow-hidden group">
            {previewImage || profile.photoURL || currentUser.photoURL ? (
                <img src={previewImage || profile.photoURL || currentUser.photoURL} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
                <div className="w-full h-full bg-indigo-100 dark:bg-slate-600 rounded-full flex items-center justify-center text-indigo-400 dark:text-slate-400">
                    <span className="material-icons-round text-4xl">person</span>
                </div>
            )}
            {/* Upload Overlay */}
            <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity rounded-full">
                <span className="material-icons-round text-white mb-1">photo_camera</span>
                <span className="text-[10px] text-white font-medium">Ubah</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
        </div>
        <h2 className="text-2xl font-bold mb-1">{profile.fullName || currentUser.displayName}</h2>
        <p className="text-indigo-200 dark:text-slate-400 text-sm">{currentUser.email}</p>
        <div className="mt-3 inline-block px-3 py-1 bg-white/20 dark:bg-slate-700 rounded-full text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
            {userRole?.replace('_', ' ') || 'Anggota'}
        </div>
      </div>"""

new_header = """      {/* Enhanced Profile Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 pt-12 pb-28 px-6 text-center text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
             <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full blur-[80px]"></div>
             <div className="absolute top-1/2 -right-24 w-64 h-64 bg-indigo-400 rounded-full blur-[80px]"></div>
        </div>

        <div className="absolute top-4 right-4 flex gap-2 z-10">
           <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all shadow-lg active:scale-95">
              <span className="material-icons-round">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
           </button>
        </div>

        <div className="relative z-10 animate-fade-in-up">
            <div className="w-28 h-28 mx-auto rounded-full bg-white/10 dark:bg-slate-700 p-1.5 mb-5 relative overflow-hidden group shadow-2xl backdrop-blur-sm border border-white/20">
                {previewImage || profile.photoURL || currentUser.photoURL ? (
                    <img src={previewImage || profile.photoURL || currentUser.photoURL} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                    <div className="w-full h-full bg-indigo-100/50 dark:bg-slate-600/50 rounded-full flex items-center justify-center text-white">
                        <span className="material-icons-round text-5xl opacity-80">person</span>
                    </div>
                )}
                {/* Upload Overlay */}
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 rounded-full backdrop-blur-sm">
                    <span className="material-icons-round text-white mb-1 transform group-hover:scale-110 transition-transform">photo_camera</span>
                    <span className="text-[10px] text-white font-bold tracking-widest uppercase">Ubah Foto</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
            </div>
            <h2 className="text-3xl font-black mb-1 tracking-tight drop-shadow-md">{profile.fullName || currentUser.displayName}</h2>
            <p className="text-indigo-100 dark:text-slate-400 text-sm font-medium mb-4 opacity-90">{currentUser.email}</p>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/20 dark:bg-slate-700/80 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/30 shadow-sm">
                <span className="material-icons-round text-[14px]">stars</span>
                {userRole?.replace('_', ' ') || 'Anggota'}
            </div>
        </div>
      </div>"""

content = content.replace(old_header, new_header)

with open('src/pages/Profile.jsx', 'w') as f:
    f.write(content)
