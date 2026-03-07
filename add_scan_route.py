import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Import the new components via lazy loading
import_str = "const AdminScanPage = lazy(() => import('./pages/AdminScanPage'));\n"

if "const AdminScanPage" not in content:
    content = content.replace("const AttendanceCheckIn = lazy(() => import('./pages/AttendanceCheckIn'));", f"const AttendanceCheckIn = lazy(() => import('./pages/AttendanceCheckIn'));\n{import_str}")

# Add the new route to the protected routes block
route_str = '              <Route path="/scan-barcode" element={<AdminScanPage />} />\n'

if "/scan-barcode" not in content:
    content = content.replace('<Route path="/absen" element={<AttendanceCheckIn />} />', f'<Route path="/absen" element={{<AttendanceCheckIn />}} />\n{route_str}')

with open('src/App.jsx', 'w') as f:
    f.write(content)

with open('src/pages/Menu.jsx', 'r') as f:
    content = f.read()

# Add to the "Administrasi" section or create a new section if wanted. Let's add to Administrasi right after Absensi
scan_item = """        { to: '/scan-barcode', icon: 'qr_code_scanner', label: 'Scan Barcode', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', allowed: ['super_admin', 'admin', 'ketua', 'wakil_ketua', 'sekretaris'] },
"""

# Actually Menu.jsx items don't natively filter by `allowed` arrays in the UI render unless I update the render logic.
# Looking at Menu.jsx, it doesn't currently filter `section.items` by role. I'll just add it to the top level.

if "'Scan Barcode'" not in content:
    content = content.replace("{ to: '/absensi', icon: 'history_toggle_off', label: 'Riwayat Absensi', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },", f"        {{ to: '/absensi', icon: 'history_toggle_off', label: 'Riwayat Absensi', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-900/30' }},\n{scan_item}")

with open('src/pages/Menu.jsx', 'w') as f:
    f.write(content)
