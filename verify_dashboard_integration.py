import os

file_path = 'src/pages/Dashboard.jsx'

with open(file_path, 'r') as f:
    content = f.read()

if 'HeroCarousel' in content and '<HeroCarousel />' in content:
    print("Dashboard integration verified.")
else:
    print("Dashboard integration failed.")
    exit(1)
