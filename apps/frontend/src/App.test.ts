import fs from 'fs';
import path from 'path';

test('App component includes BrowserRouter', () => {
  const filePath = path.resolve(__dirname, 'App.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');
  expect(content).toContain('BrowserRouter');
});
