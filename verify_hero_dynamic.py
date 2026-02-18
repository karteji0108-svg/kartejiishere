import os

files_to_check = [
    'src/components/common/HeroCarousel.jsx',
    'src/components/common/ManageHeroModal.jsx',
    'src/constants/roles.js'
]

for file_path in files_to_check:
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        exit(1)

with open('src/constants/roles.js', 'r') as f:
    content = f.read()
    if 'MANAGE_HERO' not in content:
        print("Failed: MANAGE_HERO permission missing in roles.js")
        exit(1)

print("Static verification passed.")
