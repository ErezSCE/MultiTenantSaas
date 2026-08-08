const fs = require('fs');
const path = require('path');

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

// Test Yarn workspaces configuration
const pkgPath = path.resolve(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
assert(Array.isArray(pkg.workspaces), 'workspaces should be an array');
assert(pkg.workspaces.includes('apps/*'), "workspaces should include 'apps/*'");
assert(pkg.workspaces.includes('libs/*'), "workspaces should include 'libs/*'");

// Test nx.json existence
const nxPath = path.resolve(__dirname, '..', 'nx.json');
assert(fs.existsSync(nxPath), 'nx.json should exist at root');

console.log('All workspace scaffold tests passed.');
