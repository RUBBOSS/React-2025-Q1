import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with placeholder text', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText(/search pokemon by name or id/i)).toBeInTheDocument();
  });

  it('shows initial value when provided', () => {
    render(<SearchBar onSearch={vi.fn()} initialValue="pikachu" />);
    const searchInput = screen.getByPlaceholderText(/search pokemon by name or id/i);
    expect(searchInput).toHaveValue('pikachu');
  });

  it('updates input value when typing', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    
    const searchInput = screen.getByPlaceholderText(/search pokemon by name or id/i);
    fireEvent.change(searchInput, { target: { value: 'pikachu' } });
    
    expect(searchInput).toHaveValue('pikachu');
  });

  it('shows the clear button when input has value', () => {
    render(<SearchBar onSearch={vi.fn()} initialValue="pikachu" />);
    
    expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument();
  });

  it('hides the clear button when input is empty', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    
    expect(screen.queryByLabelText(/clear search/i)).not.toBeInTheDocument();
  });

  it('clears input when clear button is clicked', () => {
    render(<SearchBar onSearch={vi.fn()} initialValue="squirtle" />);
    
    const searchInput = screen.getByPlaceholderText(/search pokemon by name or id/i);
    const clearButton = screen.getByLabelText(/clear search/i);
    
    fireEvent.click(clearButton);
    
    // Input should be cleared
    expect(searchInput).toHaveValue('');
  });

  it('calls onSearch when form is submitted', async () => {
    vi.useFakeTimers();
    const mockOnSearch = vi.fn();
    const { container } = render(<SearchBar onSearch={mockOnSearch} initialValue="charizard" />);
    
    // Get the form and submit directly with submit event
    const form = container.querySelector('form');
    
    // Ensure form is not null before proceeding
    if (!form) {
      throw new Error('Form element not found');
    }
    
    // Create a custom submit event with preventDefault method
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    submitEvent.preventDefault = vi.fn();
    
    // Use act to wrap event dispatch for React state updates
    act(() => {
      form.dispatchEvent(submitEvent);
    });
    
    // Run any pending timers
    act(() => {
      vi.runAllTimers();
    });
    
    expect(submitEvent.preventDefault).toHaveBeenCalled();
    expect(mockOnSearch).toHaveBeenCalledWith('charizard');
    vi.useRealTimers();
  });

  it('finds submit button using the right selector', () => {
    render(<SearchBar onSearch={vi.fn()} initialValue="mewtwo" />);
    
    // Use a more precise query to find the submit button
    // First get all buttons with type=submit 
    const buttons = screen.getAllByRole('button');
    const submitButton = buttons.find(button => button.getAttribute('type') === 'submit');
    
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('initializes with empty string when no initialValue is provided', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText(/search pokemon by name or id/i)).toHaveValue('');
  });
  
  it('has correct input type', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    const searchInput = screen.getByPlaceholderText(/search pokemon by name or id/i);
    expect(searchInput).toHaveAttribute('type', 'text');
  });
  
  it('applies proper styling to the search container', () => {
    const { container } = render(<SearchBar onSearch={vi.fn()} />);
    const searchContainer = container.querySelector('.relative');
    expect(searchContainer).not.toBeNull();
  });
  
  it('has search icon in the submit button', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    
    // Get all buttons and find the one that's a submit button
    const buttons = screen.getAllByRole('button');
    const submitButton = buttons.find(button => button.getAttribute('type') === 'submit');
    
    if (!submitButton) {
      throw new Error('Submit button not found');
    }
    
    const svgElement = submitButton.querySelector('svg');
    
    expect(svgElement).toBeInTheDocument();
    if (!svgElement) throw new Error('SVG element not found');
    expect(svgElement.classList.contains('h-5')).toBe(true);
    expect(svgElement.classList.contains('w-5')).toBe(true);
  });
});
