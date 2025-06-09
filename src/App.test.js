import { render, screen } from '@testing-library/react';
import App from './App';

beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
});

test('renders forest interlude continue button', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /Continue Your Journey/i })).toBeInTheDocument();
});
