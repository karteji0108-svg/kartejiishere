import re

with open('src/pages/Menu.jsx', 'r') as f:
    content = f.read()

# Add 'admin' temporarily to avoid confusion if the user is testing with an admin account
content = content.replace("allowed: ['super_admin', 'sekretaris']", "allowed: ['super_admin', 'sekretaris', 'admin']")

with open('src/pages/Menu.jsx', 'w') as f:
    f.write(content)
