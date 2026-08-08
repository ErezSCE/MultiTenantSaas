import fs from 'fs';
import * as path from 'path';

test('App component includes BrowserRouter', () => {
  const filePath = path.resolve(process.cwd(), 'apps/frontend/src/App.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');
  expect(content).toContain('BrowserRouter');
});
