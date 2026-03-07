import re

# 1. Menu.jsx
with open('src/pages/Menu.jsx', 'r') as f:
    content = f.read()

# Update allowed arrays for Absensi and Scan Barcode
content = content.replace(
    "allowed: ['super_admin', 'admin', 'ketua', 'wakil_ketua', 'sekretaris']",
    "allowed: ['super_admin', 'sekretaris']"
)
with open('src/pages/Menu.jsx', 'w') as f:
    f.write(content)


# 2. AttendanceDashboard.jsx
with open('src/pages/AttendanceDashboard.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const canViewAll = ['super_admin', 'admin', 'ketua', 'wakil_ketua', 'sekretaris'].includes(userRole);",
    "const canViewAll = ['super_admin', 'sekretaris'].includes(userRole);"
)
with open('src/pages/AttendanceDashboard.jsx', 'w') as f:
    f.write(content)


# 3. ActivityDetail.jsx
with open('src/pages/ActivityDetail.jsx', 'r') as f:
    content = f.read()

if "const canManageAttendance = ['super_admin', 'sekretaris'].includes(userRole);" not in content:
    content = content.replace(
        "const canManage = ['super_admin', 'admin', 'ketua', 'wakil_ketua', 'sekretaris', 'content_creator'].includes(userRole);",
        "const canManage = ['super_admin', 'admin', 'ketua', 'wakil_ketua', 'sekretaris', 'content_creator'].includes(userRole);\n  const canManageAttendance = ['super_admin', 'sekretaris'].includes(userRole);"
    )
    # Re-map the attendance block to use canManageAttendance
    content = content.replace("{/* Attendance Management (Admin Only) */}\n          {canManage && (", "{/* Attendance Management (Admin Only) */}\n          {canManageAttendance && (")
    # Re-map the query fetch logic for attendance
    content = content.replace("        if (canManage) {\n            const attQ", "        if (canManageAttendance) {\n            const attQ")
    content = content.replace("}, [id, navigate, canManage]);", "}, [id, navigate, canManage, canManageAttendance]);")

with open('src/pages/ActivityDetail.jsx', 'w') as f:
    f.write(content)
