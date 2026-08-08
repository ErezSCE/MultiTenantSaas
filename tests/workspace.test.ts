import * as fs from 'fs';
import * as path from 'path';

test('workspace scaffold configuration (TS)', () => {
  const pkgPath = path.resolve(__dirname, '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as any;
  expect(Array.isArray(pkg.workspaces)).toBe(true);
  expect(pkg.workspaces).toContain('apps/*');
  expect(pkg.workspaces).toContain('libs/*');

  const nxPath = path.resolve(__dirname, '..', 'nx.json');
  expect(fs.existsSync(nxPath)).toBe(true);
});
