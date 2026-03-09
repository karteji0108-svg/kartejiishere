const fs = require('fs');

let rulesCode = fs.readFileSync('firestore.rules', 'utf8');

// Update Users Collection Delete Rule
rulesCode = rulesCode.replace(
/      \/\/ Delete: Only Super Admin\n      allow delete: if isSuperAdmin\(\);/g,
`      // Delete: Super Admin, Ketua, Wakil Ketua
      allow delete: if isSuperAdmin() || isKetua() || isWakil();`
);

// Update Users Collection Update Rule
rulesCode = rulesCode.replace(
/      allow update: if isOwner\(userId\) \|\| isSuperAdmin\(\) \|\| isSekretaris\(\);/g,
`      allow update: if isOwner(userId) || isSuperAdmin() || isSekretaris() || isKetua() || isWakil();`
);

// Update Finance Collection Read/Write Rule
rulesCode = rulesCode.replace(
/      allow write: if isBendahara\(\) \|\| isSuperAdmin\(\);/g,
`      allow write: if isBendahara() || isSuperAdmin() || isKetua() || isWakil();`
);

// Update Announcements
rulesCode = rulesCode.replace(
/      allow write: if isSuperAdmin\(\) \|\| isKetua\(\) \|\| isWakil\(\) \|\| isSekretaris\(\);/g,
`      allow write: if isAuthenticated();`
);

// Update Gallery
rulesCode = rulesCode.replace(
/      allow write: if isSuperAdmin\(\) \|\| isSekretaris\(\);/g,
`      allow write: if isAuthenticated();`
);

fs.writeFileSync('firestore.rules', rulesCode);
