import { render, screen } from '@testing-library/react';
import App from './App';

test('shows galactic scroll on load', () => {
  render(<App />);
  expect(screen.getByTestId('galactic-scroll')).toBeInTheDocument();
});
