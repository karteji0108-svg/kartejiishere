# The user wants "Scan Barcode" menu.
# I noticed Menu.jsx maps blindly. I should implement the `allowed` logic so non-admins don't see it.
import re

with open('src/pages/Menu.jsx', 'r') as f:
    content = f.read()

# Make sure useAuth is imported
if "useAuth" not in content:
    content = content.replace("import BottomNav from '../components/layout/BottomNav';", "import BottomNav from '../components/layout/BottomNav';\nimport { useAuth } from '../context/AuthContext';")

# Extract userRole inside the component
if "const { userRole } = useAuth();" not in content:
    content = content.replace("const Menu = () => {", "const Menu = () => {\n  const { userRole } = useAuth();\n")

# Filter items during render
old_render = """              {section.items.map((item) => ("""
new_render = """              {section.items.filter(item => !item.allowed || item.allowed.includes(userRole)).map((item) => ("""

content = content.replace(old_render, new_render)

with open('src/pages/Menu.jsx', 'w') as f:
    f.write(content)
