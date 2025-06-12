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
