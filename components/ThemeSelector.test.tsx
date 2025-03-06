import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSelector from './ThemeSelector';
import { useTheme } from '../context/ThemeContext';
vi.mock('../context/ThemeContext', () => ({
  useTheme: vi.fn()
}));
describe('ThemeSelector', () => {
  it('renders light and dark mode options', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });
    render(<ThemeSelector />);
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });
  it('highlights light mode button when theme is light', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });
    render(<ThemeSelector />);
    const lightButton = screen.getByText('Light').closest('button');
    const darkButton = screen.getByText('Dark').closest('button');
    expect(lightButton).toHaveClass('bg-blue-600');
    expect(darkButton).not.toHaveClass('bg-blue-600');
  });
  it('highlights dark mode button when theme is dark', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
    });
    render(<ThemeSelector />);
    const lightButton = screen.getByText('Light').closest('button');
    const darkButton = screen.getByText('Dark').closest('button');
    expect(darkButton).toHaveClass('bg-blue-600');
    expect(lightButton).not.toHaveClass('bg-blue-600');
  });
  it('calls setTheme with "light" when light button is clicked', () => {
    const mockSetTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });
    render(<ThemeSelector />);
    const lightButton = screen.getByText('Light').closest('button');
    if (lightButton) {
      fireEvent.click(lightButton);
    }
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
  it('calls setTheme with "dark" when dark button is clicked', () => {
    const mockSetTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });
    render(<ThemeSelector />);
    const darkButton = screen.getByText('Dark').closest('button');
    if (darkButton) {
      fireEvent.click(darkButton);
    }
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
  it('calls setTheme when toggle button is clicked', () => {
    const mockSetTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });
    render(<ThemeSelector />);
    const toggleButton = screen.getAllByRole('button')[2]; 
    fireEvent.click(toggleButton);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
