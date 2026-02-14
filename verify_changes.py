import os

def check_file_contains(filepath, search_strings):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"FAIL: {filepath} not found.")
        return False

    missing = []
    for s in search_strings:
        if s not in content:
            missing.append(s)

    if missing:
        print(f"FAIL: {filepath} is missing: {missing}")
        return False
    else:
        print(f"PASS: {filepath} contains all required strings.")
        return True

# 1. New Directory Structure
paths_to_check = [
    'src/components/layout/BottomNav.jsx',
    'src/components/common/ThemeToggle.jsx',
    'src/components/common/Skeleton.jsx',
    'src/components/common/RamadanBanner.jsx',
    'src/components/auth/ProtectedRoute.jsx'
]

for path in paths_to_check:
    if not os.path.exists(path):
        print(f"FAIL: {path} does not exist.")
    else:
        print(f"PASS: {path} exists.")

# 2. Imports in Key Files
check_file_contains('src/App.jsx', [
    'components/layout/BottomNav',
    'components/common/RamadanDecorations',
    'components/auth/ProtectedRoute'
])

check_file_contains('src/pages/Dashboard.jsx', [
    'components/layout/BottomNav',
    'components/common/ThemeToggle',
    'glass-card',
    'bg-ramadan'
])

# 3. Glassmorphism Application
check_file_contains('src/pages/Login.jsx', ['bg-ramadan', 'glass-card', 'glass-input', 'ThemeToggle'])
check_file_contains('src/pages/Profile.jsx', ['bg-ramadan', 'glass-card', 'glass-input'])
check_file_contains('src/pages/MemberList.jsx', ['bg-ramadan', 'glass-card', 'glass-input', 'glass-header'])
check_file_contains('src/pages/Activities.jsx', ['bg-ramadan', 'glass-card', 'glass-input', 'glass-header'])
check_file_contains('src/pages/Announcements.jsx', ['bg-ramadan', 'glass-card', 'glass-header'])
check_file_contains('src/pages/Finance.jsx', ['bg-ramadan', 'glass-card', 'glass-header', 'bg-gradient-to-br'])

print("Verification Complete")
