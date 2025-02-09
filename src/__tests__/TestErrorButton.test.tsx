import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TestErrorButton from '../components/TestErrorButton';

describe('TestErrorButton', () => {
  it('renders button', () => {
    render(<TestErrorButton />);
    expect(screen.getByText('Trigger Test Error')).toBeInTheDocument();
  });

  it('throws error when clicked', () => {
    render(<TestErrorButton />);
    const button = screen.getByText('Trigger Test Error');

    expect(() => {
      fireEvent.click(button);
    }).toThrow('This is a test error!');
  });
});
