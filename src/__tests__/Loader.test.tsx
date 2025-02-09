import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loader from '../components/Loader';

describe('Loader', () => {
  it('renders loader with correct attributes', () => {
    render(<Loader />);
    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
    expect(loader.parentElement).toHaveClass('animate-pulse');
  });

  it('displays loading text', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
