import re

with open('src/pages/Profile.jsx', 'r') as f:
    content = f.read()

# Add link to top of scrollable content if missing
btn_html = """
           {/* Digital ID Card Link */}
           <div className="flex justify-center mb-4">
              <Link
                  to="/kartu-anggota"
                  className="w-full py-3.5 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 transition-all font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm flex items-center justify-center gap-2"
              >
                  <span className="material-icons-round text-xl">badge</span>
                  Lihat Kartu Anggota Digital
              </Link>
           </div>
"""

if "Lihat Kartu Anggota Digital" not in content:
    # Insert right before the Action Buttons
    # {isEditing ? (
    content = content.replace("           <div className=\"flex gap-3\">\n              {isEditing ? (", f"{btn_html}\n           <div className=\"flex gap-3\">\n              {{isEditing ? (")

with open('src/pages/Profile.jsx', 'w') as f:
    f.write(content)
