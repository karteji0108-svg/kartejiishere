import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Import the new components via lazy loading
imports = """
const DigitalCardPage = lazy(() => import('./pages/DigitalCardPage'));
const AttendanceDashboard = lazy(() => import('./pages/AttendanceDashboard'));
const AttendanceScan = lazy(() => import('./pages/AttendanceScan'));
"""

if "const DigitalCardPage" not in content:
    content = content.replace("// New Features", f"{imports}\n// New Features")

# Add the new routes
new_routes = """
              {/* Absensi & ID Card */}
              <Route path="/kartu-digital" element={<DigitalCardPage />} />
              <Route path="/absen" element={<AttendanceScan />} />
"""

if "/kartu-digital" not in content:
    content = content.replace('<Route path="/profile" element={<Profile />} />', f'<Route path="/profile" element={{<Profile />}} />{new_routes}')

# Add admin route
admin_routes = """
              {/* Absensi Admin */}
              <Route path="/absensi" element={<AttendanceDashboard />} />
"""

if "/absensi" not in content:
    content = content.replace('<Route path="/gallery/add" element={<AddGalleryPhoto />} />', f'<Route path="/gallery/add" element={{<AddGalleryPhoto />}} />\n{admin_routes}')

with open('src/App.jsx', 'w') as f:
    f.write(content)
