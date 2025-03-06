import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';
describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it('renders with the correct placeholder text', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search Pokemon by name or ID...')).toBeInTheDocument();
  });
  it('renders with the initial value when provided', () => {
    render(<SearchBar onSearch={vi.fn()} initialValue="pikachu" />);
    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
  });
  it('shows a reset button when there is text input', () => {
    render(<SearchBar onSearch={vi.fn()} initialValue="pikachu" />);
    const resetButton = screen.getByRole('button', { name: '' });
    expect(resetButton).toBeInTheDocument();
  });
  it('does not show a reset button when there is no text input', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });
  it('calls onSearch when form is submitted', async () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'pikachu' } });
    const form = input.closest('form');
    fireEvent.submit(form!);
    vi.runAllTimers();
    expect(mockOnSearch).toHaveBeenCalledWith('pikachu');
  });
  it('calls onSearch with empty string when reset button is clicked', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} initialValue="pikachu" />);
    const resetButton = screen.getByLabelText('Clear search');
    fireEvent.click(resetButton);
    vi.runAllTimers();
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
  it('updates the search term when typing in the input', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'pikachu' } });
    expect(input).toHaveValue('pikachu');
  });
  it('trims and lowercases the search term when submitting', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '  PiKaChU  ' } });
    const form = input.closest('form');
    fireEvent.submit(form!);
    vi.runAllTimers();
    expect(mockOnSearch).toHaveBeenCalledWith('pikachu');
  });
});
