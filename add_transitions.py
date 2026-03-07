import re

def add_transition(file_path):
    try:
        with open(file_path, 'r') as f:
            content = f.read()

        # Target the main container div after the return statement
        # We'll look for min-h-screen
        if "min-h-screen bg-slate-50" in content and "animate-fade-in" not in content:
             content = content.replace('min-h-screen bg-slate-50', 'min-h-screen bg-slate-50 animate-fade-in')
        elif "min-h-screen bg-background-light" in content and "animate-fade-in" not in content:
             content = content.replace('min-h-screen bg-background-light', 'min-h-screen bg-background-light animate-fade-in')
        elif "min-h-screen bg-gray-50" in content and "animate-fade-in" not in content:
             content = content.replace('min-h-screen bg-gray-50', 'min-h-screen bg-gray-50 animate-fade-in')

        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Updated {file_path}")
    except Exception as e:
        print(f"Failed {file_path}: {e}")

files = [
    'src/pages/Dashboard.jsx',
    'src/pages/Activities.jsx',
    'src/pages/Finance.jsx',
    'src/pages/Profile.jsx',
    'src/pages/MemberList.jsx',
    'src/pages/ActivityGallery.jsx'
]

for f in files:
    add_transition(f)
