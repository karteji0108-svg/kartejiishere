const fs = require('fs');

// DASHBOARD
let dashCode = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

if (!dashCode.includes('recentGallery')) {
    // Add recentGallery state
    dashCode = dashCode.replace(
    /  const \[announcements, setAnnouncements\] = useState\(\[\]\);/g,
    `  const [announcements, setAnnouncements] = useState([]);\n  const [recentGallery, setRecentGallery] = useState([]);`
    );

    // Add fetching logic
    const fetchGalleryCode = `
                // Fetch Recent Gallery
                const galleryQ = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(4));
                const gallerySnap = await getDocs(galleryQ);
                setRecentGallery(gallerySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    `;
    dashCode = dashCode.replace(
    /                \/\/ Fetch Announcements\n                const annQ = query\(collection\(db, 'announcements'\), orderBy\('createdAt', 'desc'\), limit\(5\)\);\n                const annSnap = await getDocs\(annQ\);\n                setAnnouncements\(annSnap.docs.map\(doc => \(\{ id: doc.id, ...doc.data\(\) \}\)\)\);/g,
    `                // Fetch Announcements\n                const annQ = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(5));\n                const annSnap = await getDocs(annQ);\n                setAnnouncements(annSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));\n${fetchGalleryCode}`
    );

    // Add the UI section
    const gallerySection = `
            {/* 6. Recent Gallery (Image Grid) */}
            <section className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col mt-6">
                 <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="material-icons-round text-[18px] text-purple-500">collections</span> Galeri Terbaru
                    </h2>
                    <Link to="/gallery" className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">
                        View All
                    </Link>
                </div>
                <div className="p-4">
                    {recentGallery.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {recentGallery.map((img) => (
                                <Link to="/gallery" key={img.id} className="aspect-square rounded-lg overflow-hidden group border border-slate-200 dark:border-slate-700 block bg-slate-100 dark:bg-slate-700">
                                    <img src={img.imageURL} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
                            <span className="material-icons-round text-3xl mb-2 text-slate-300">image_not_supported</span>
                            <p className="text-sm font-medium">Belum ada foto galeri.</p>
                        </div>
                    )}
                </div>
            </section>
    `;

    dashCode = dashCode.replace(
    /            <\/section>\n        <\/div>\n      <\/div>\n      <BottomNav \/>/g,
    `            </section>\n        </div>\n${gallerySection}\n      </div>\n      <BottomNav />`
    );
}

// Make MetricCard clickable
if (!dashCode.includes('onClick={onClick}')) {
    dashCode = dashCode.replace(
    /const MetricCard = \(\{\s*label,\s*value,\s*icon\s*\}\) => \([\s\S]*?    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between h-28 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">/g,
    `const MetricCard = ({ label, value, icon, onClick }) => (\n    <div onClick={onClick} className={\`bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between h-28 transition-colors \${onClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600' : 'hover:border-slate-300 dark:hover:border-slate-600'}\`}>`
    );

    dashCode = dashCode.replace(
    /            <MetricCard\n                label="Total Members"\n                value=\{formatNumber\(stats\.members\)\}\n                icon="groups"\n            \/>/g,
    `            <MetricCard\n                label="Total Members"\n                value={formatNumber(stats.members)}\n                icon="groups"\n                onClick={() => navigate('/members')}\n            />`
    );

    dashCode = dashCode.replace(
    /            <MetricCard\n                label="Total Activities"\n                value=\{formatNumber\(stats\.activities\)\}\n                icon="event_note"\n            \/>/g,
    `            <MetricCard\n                label="Total Activities"\n                value={formatNumber(stats.activities)}\n                icon="event_note"\n                onClick={() => navigate('/activities')}\n            />`
    );
}

fs.writeFileSync('src/pages/Dashboard.jsx', dashCode);
