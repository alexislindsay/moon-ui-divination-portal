import { render, screen } from '@testing-library/react';
import { act } from 'react';
import App from './App';

jest.useFakeTimers();

test('renders portal title after intro', () => {
  render(<App />);
  act(() => {
    jest.runAllTimers();
  });
  expect(screen.getByText(/Moon UI Divination Portal/i)).toBeInTheDocument();
});
