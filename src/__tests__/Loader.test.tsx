import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loader from '../components/Loader';

describe('Loader', () => {
  it('renders loading spinner', () => {
    render(<Loader />);
    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('animate-spin');
  });

  it('has correct styling', () => {
    render(<Loader />);
    const wrapper = screen.getByTestId('loader').parentElement;
    expect(wrapper).toHaveClass(
      'fixed',
      'top-0',
      'left-0',
      'right-0',
      'bottom-0',
      'flex',
      'items-center',
      'justify-center',
      'z-50'
    );
  });
});
