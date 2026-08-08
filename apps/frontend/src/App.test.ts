import { render, screen } from '@testing-library/react';
import App from './App';

test('App renders Home route within BrowserRouter', () => {
  render(<App />);
  // The Home component contains a heading with text "Welcome to Multitenant SaaS"
  const heading = screen.getByRole('heading', { name: /welcome to multitenant saas/i });
  expect(heading).toBeInTheDocument();
});
