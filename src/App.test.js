import { render, screen } from '@testing-library/react';
import App from './App';

codex/identify-issues-and-propose-tasks
test('shows galactic scroll on load', () => {
  render(<App />);
  expect(screen.getByTestId('galactic-scroll')).toBeInTheDocument();

beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
});

test('renders forest interlude continue button', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /Continue Your Journey/i })).toBeInTheDocument();
main
});
