import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert';

test('AddTransaction.jsx should not contain super_admin assignment', (t) => {
  const content = fs.readFileSync('src/pages/AddTransaction.jsx', 'utf8');
  assert.ok(!content.includes("role: 'super_admin'"), "Should not assign role: 'super_admin'");
  assert.ok(!content.includes("ensureUserPermissions"), "Should not contain ensureUserPermissions function");
});

test('AuthContext.jsx should not contain super_admin assignment', (t) => {
  const content = fs.readFileSync('src/context/AuthContext.jsx', 'utf8');
  assert.ok(!content.includes('role: "super_admin"'), "Should not assign role: \"super_admin\"");
  // Also check for the comment from the vulnerability report
  assert.ok(!content.includes('// Default for dev/testing'), "Should not contain dev/testing default comment");
});
