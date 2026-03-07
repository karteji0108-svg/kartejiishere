with open('src/pages/Profile.jsx', 'r') as f:
    content = f.read()

# Check if react-router-dom is already imported
if "import { Link } from 'react-router-dom';" not in content:
    if "import { useNavigate" in content:
        content = content.replace("import { useNavigate", "import { useNavigate, Link")
    else:
        # Add the import at the top
        content = content.replace(
            "import React, { useState, useEffect, useRef } from 'react';",
            "import React, { useState, useEffect, useRef } from 'react';\nimport { Link } from 'react-router-dom';"
        )

with open('src/pages/Profile.jsx', 'w') as f:
    f.write(content)
