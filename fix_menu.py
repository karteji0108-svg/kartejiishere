with open('src/pages/Menu.jsx', 'r') as f:
    content = f.read()

# Add Kartu Digital to Utama
kartu_digital_item = """        { to: '/kartu-anggota', icon: 'badge', label: 'Kartu Anggota', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
"""

if "'Kartu Anggota'" not in content:
    content = content.replace("        { to: '/members', icon: 'groups', label: 'Anggota', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },", f"        {{ to: '/members', icon: 'groups', label: 'Anggota', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' }},\n{kartu_digital_item}")

absensi_item = """        { to: '/absensi', icon: 'history_toggle_off', label: 'Riwayat Absensi', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
"""

if "'Riwayat Absensi'" not in content:
    content = content.replace("        { to: '/inventory', icon: 'inventory_2', label: 'Inventaris', desc: 'Aset Organisasi', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },", f"        {{ to: '/inventory', icon: 'inventory_2', label: 'Inventaris', desc: 'Aset Organisasi', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' }},\n{absensi_item}")

with open('src/pages/Menu.jsx', 'w') as f:
    f.write(content)
