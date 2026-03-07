import re

with open('src/pages/Menu.jsx', 'r') as f:
    content = f.read()

# Make sure filter correctly handles empty userRole just in case
old_filter = "filter(item => !item.allowed || item.allowed.includes(userRole))"
new_filter = "filter(item => !item.allowed || (userRole && item.allowed.includes(userRole)))"

content = content.replace(old_filter, new_filter)

with open('src/pages/Menu.jsx', 'w') as f:
    f.write(content)
