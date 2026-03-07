import re

with open('src/pages/Dashboard.jsx', 'r') as f:
    content = f.read()

# Enhance section headers and transitions
old_activities_header = """                 <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="material-icons-round text-[18px] text-accent">local_activity</span> Recent Activities
                    </h2>
                    <Link to="/activities" className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">
                        View All
                    </Link>
                </div>"""

new_activities_header = """                 <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>
                    <h2 className="text-base font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="material-icons-round text-[20px] text-accent">local_activity</span> Kegiatan Terbaru
                    </h2>
                    <Link to="/activities" className="text-xs font-bold text-accent hover:text-accent-hover bg-accent/10 px-2 py-1 rounded-md transition-colors">
                        Lihat Semua
                    </Link>
                </div>"""
content = content.replace(old_activities_header, new_activities_header)

old_announcements_header = """                 <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="material-icons-round text-[18px] text-amber-500">campaign</span> Internal Announcements
                    </h2>
                    <Link to="/announcements" className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">
                        View All
                    </Link>
                </div>"""

new_announcements_header = """                 <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                    <h2 className="text-base font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="material-icons-round text-[20px] text-amber-500">campaign</span> Pengumuman
                    </h2>
                    <Link to="/announcements" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md transition-colors">
                        Lihat Semua
                    </Link>
                </div>"""
content = content.replace(old_announcements_header, new_announcements_header)

old_gallery_header = """            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="material-icons-round text-[18px] text-purple-500">collections</span> Galeri Terbaru
                </h2>
                <Link to="/gallery" className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">
                    View All
                </Link>
            </div>"""

new_gallery_header = """            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                <h2 className="text-base font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="material-icons-round text-[20px] text-purple-500">collections</span> Galeri Terbaru
                </h2>
                <Link to="/gallery" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md transition-colors">
                    Lihat Semua
                </Link>
            </div>"""
content = content.replace(old_gallery_header, new_gallery_header)

with open('src/pages/Dashboard.jsx', 'w') as f:
    f.write(content)
