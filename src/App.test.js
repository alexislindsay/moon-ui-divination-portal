import { render, screen } from '@testing-library/react';
import App from './App';

test('renders intro message', () => {
  render(<App />);
  expect(screen.getByText(/Entering the Cosmic Current/i)).toBeInTheDocument();
});
