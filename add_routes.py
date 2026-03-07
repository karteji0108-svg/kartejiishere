import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Import the new components via lazy loading
imports = """
const DigitalCardPage = lazy(() => import('./pages/DigitalCardPage'));
const AttendanceCheckIn = lazy(() => import('./pages/AttendanceCheckIn'));
"""

if "const DigitalCardPage" not in content:
    content = content.replace("// New Features", f"{imports}\n// New Features")

# Add the new routes
new_routes = """
              {/* Absensi & ID Card */}
              <Route path="/kartu-anggota" element={<DigitalCardPage />} />
              <Route path="/absen" element={<AttendanceCheckIn />} />
"""

if "/kartu-anggota" not in content:
    content = content.replace('<Route path="/profile" element={<Profile />} />', f'<Route path="/profile" element={{<Profile />}} />{new_routes}')

with open('src/App.jsx', 'w') as f:
    f.write(content)

with open('src/pages/Menu.jsx', 'r') as f:
    content = f.read()

# Add Kartu Anggota to all users
kartu_digital_item = """
        {
          label: "Kartu Anggota",
          icon: "badge",
          to: "/kartu-anggota",
          color: "text-indigo-500",
          bg: "bg-indigo-50 dark:bg-indigo-900/20",
          allowed: ['super_admin', 'admin', 'ketua', 'wakil_ketua', 'sekretaris', 'bendahara', 'humas', 'content_creator', 'anggota']
        },
"""

if '"Kartu Anggota"' not in content:
    content = content.replace('label: "Profil & Akun"', f"{kartu_digital_item}\n        {{\n          label: \"Profil & Akun\"")

with open('src/pages/Menu.jsx', 'w') as f:
    f.write(content)
