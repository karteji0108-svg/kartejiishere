import re

with open('src/pages/Profile.jsx', 'r') as f:
    content = f.read()

btn_html = """
        {/* Digital ID Card Link */}
        <div className="mt-8 flex justify-center px-6">
            <Link
                to="/kartu-anggota"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 transition-all font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm"
            >
                <span className="material-icons-round text-xl">badge</span>
                Lihat Kartu Anggota Digital
            </Link>
        </div>
"""

# Insert before "Aksi Lainnya"
if "Lihat Kartu Anggota Digital" not in content:
    content = content.replace("{/* Aksi Lainnya */}", f"{btn_html}\n        {{/* Aksi Lainnya */}}")

# Import Link if not already imported
if "import { Link } from 'react-router-dom';" not in content and "import { Link" not in content:
    content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate, Link } from 'react-router-dom';")
elif "import { useNavigate } from 'react-router-dom';" not in content and "import { useNavigate" not in content:
     content = content.replace("import { useNavigate, Link } from 'react-router-dom';", "import { useNavigate, Link } from 'react-router-dom';")

with open('src/pages/Profile.jsx', 'w') as f:
    f.write(content)
