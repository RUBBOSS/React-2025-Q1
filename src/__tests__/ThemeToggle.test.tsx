import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeProvider } from '../context/ThemeContext';

describe('ThemeToggle', () => {
  it('toggles theme when clicked', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(screen.getByAltText('Sun')).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByAltText('Moon')).toBeInTheDocument();
  });
});
