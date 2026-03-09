const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

code = code.replace(
/      <\/div>\n      <BottomNav \/>\n    <\/div>\n  \);\n\};/g,
`      </div>\n    </div>\n      <BottomNav />\n  );\n};`
);

fs.writeFileSync('src/pages/Dashboard.jsx', code);
