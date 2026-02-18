import os

file_path = 'src/components/common/HeroCarousel.jsx'

with open(file_path, 'r') as f:
    content = f.read()

# Check if the fallback for empty slides is present and robust
checks = [
    'if (slides.length === 0)',
    'return (',
    'Setup Hero Banner',
    'Belum ada banner yang ditampilkan',
    'canManage'
]

for check in checks:
    if check not in content:
        print(f"Failed: '{check}' not found in HeroCarousel.jsx")
        exit(1)

print("Static verification passed: Placeholder logic is present.")
