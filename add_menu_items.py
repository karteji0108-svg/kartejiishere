import re

with open('src/pages/Menu.jsx', 'r') as f:
    content = f.read()

# Add Kartu Digital to all users
kartu_digital_item = """
        {
          label: "Kartu Digital",
          icon: "badge",
          to: "/kartu-digital",
          color: "text-indigo-500",
          bg: "bg-indigo-50 dark:bg-indigo-900/20",
          allowed: ['super_admin', 'admin', 'ketua', 'wakil_ketua', 'sekretaris', 'bendahara', 'humas', 'content_creator', 'anggota']
        },
"""

if '"Kartu Digital"' not in content:
    content = content.replace('label: "Profil & Akun"', f"{kartu_digital_item}\n        {{\n          label: \"Profil & Akun\"")

# Add Absensi to admins
absensi_item = """
        {
          label: "Laporan Absensi",
          icon: "history_toggle_off",
          to: "/absensi",
          color: "text-cyan-500",
          bg: "bg-cyan-50 dark:bg-cyan-900/20",
          allowed: ['super_admin', 'admin', 'ketua', 'wakil_ketua', 'sekretaris']
        },
"""

if '"Laporan Absensi"' not in content:
    content = content.replace('label: "Keuangan"', f"{absensi_item}\n        {{\n          label: \"Keuangan\"")


with open('src/pages/Menu.jsx', 'w') as f:
    f.write(content)
