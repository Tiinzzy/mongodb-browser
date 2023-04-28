import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';
import Header from '../components/Header';

test('Testing Footer', () => {
  render(<Footer />);
  expect(screen.getByTestId("footer-main-box")).toHaveTextContent('Designed');
});


test('Testing  Header', () => {
  render(<Header />);
  expect(screen.getByTestId("header-main-box")).toHaveTextContent('MongoDB');
});