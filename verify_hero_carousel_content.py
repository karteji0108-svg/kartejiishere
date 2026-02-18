import os

file_path = 'src/components/common/HeroCarousel.jsx'

if not os.path.exists(file_path):
    print(f"Error: {file_path} not found.")
    exit(1)

with open(file_path, 'r') as f:
    content = f.read()

checks = [
    ('swiper/react', 'Swiper import'),
    ('swiper/modules', 'Swiper modules import'),
    ('f_auto,q_auto,c_fill,w_1600,ar_16:9', 'Cloudinary transformations'),
    ('Skeleton', 'Skeleton loader'),
    ('autoplay', 'Autoplay config'),
    ('glassmorphism', 'backdrop-blur-md') # checking for class
]

failed = False
for check, name in checks:
    if check not in content:
        print(f"Failed: {name} not found in content.")
        failed = True
    else:
        print(f"Passed: {name}")

if failed:
    exit(1)
print("All static checks passed.")
