const fs = require('fs');
let rules = fs.readFileSync('firestore.rules', 'utf8');

// remove misaligned block at end
rules = rules.replace(
/\n    \/\/ Attendance Collection\n    match \/attendance\/\{document=\*\*\} \{\n      \/\/ Anyone authenticated can read and write to record their attendance scan\n      allow read: if isAuthenticated\(\);\n      allow write: if isAuthenticated\(\);\n    \}\n/g,
''
);

// inject it correctly before the final closing brace
rules = rules.replace(
/    \/\/ Hero Slides Collection\n    match \/hero_slides\/\{document=\*\*\} \{\n      allow read: if true;\n      allow write: if isSuperAdmin\(\) \|\| isKetua\(\) \|\| isWakil\(\);\n    \}\n  \}\n\}/g,
`    // Hero Slides Collection
    match /hero_slides/{document=**} {
      allow read: if true;
      allow write: if isSuperAdmin() || isKetua() || isWakil();
    }

    // Attendance Collection
    match /attendance/{document=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
  }
}`
);

fs.writeFileSync('firestore.rules', rules);
