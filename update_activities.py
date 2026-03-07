import re

with open('src/pages/Activities.jsx', 'r') as f:
    content = f.read()

old_card = """                <Link to={`/activities/${activity.id}`} key={activity.id} className="card p-3 flex gap-4 group active:scale-[0.99] transition-all duration-200 hover:shadow-md">
                    <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 relative">
                        {activity.image ? (
                            <img src={activity.image} alt={activity.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="material-icons text-3xl">image</span>
                            </div>
                        )}
                        <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                            {formatDate(activity.date)}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2 text-sm mb-1 group-hover:text-primary transition-colors">{activity.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-2">{activity.description}</p>

                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                             <span className="material-icons text-[12px]">location_on</span>
                             <span className="truncate">{activity.location || 'Lokasi belum ditentukan'}</span>
                        </div>
                    </div>
                </Link>"""

new_card = """                <Link to={`/activities/${activity.id}`} key={activity.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 dark:border-slate-700/50 group active:scale-[0.98] animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-40 h-40 sm:h-auto bg-slate-100 dark:bg-slate-700 relative overflow-hidden shrink-0">
                            {activity.image ? (
                                <img src={activity.image} alt={activity.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <span className="material-icons-round text-4xl">event</span>
                                </div>
                            )}
                            <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-white/20 flex flex-col items-center justify-center">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{new Date(activity.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                                <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{new Date(activity.date).getDate()}</span>
                            </div>
                        </div>
                        <div className="p-4 sm:p-5 flex-1 min-w-0 flex flex-col justify-center">
                            <h3 className="font-black text-slate-900 dark:text-white text-base mb-1.5 group-hover:text-primary transition-colors line-clamp-2">{activity.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">{activity.description}</p>

                            <div className="mt-auto flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                 <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300">
                                     <span className="material-icons-round text-[12px] text-rose-500">place</span>
                                     <span className="truncate max-w-[150px]">{activity.location || 'Lokasi belum ditentukan'}</span>
                                 </span>
                            </div>
                        </div>
                    </div>
                </Link>"""

content = content.replace(old_card, new_card)

with open('src/pages/Activities.jsx', 'w') as f:
    f.write(content)
