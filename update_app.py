import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Replace Gallery import
content = content.replace("const Gallery = lazy(() => import('./pages/Gallery'));", "")

# Replace the element mapping
content = content.replace("element={<Gallery />}", "element={<ActivityGallery />}")

with open('src/App.jsx', 'w') as f:
    f.write(content)
