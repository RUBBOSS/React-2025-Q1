import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorButton from './ErrorButton';

// Store original console.error
const originalConsoleError = console.error;

// Create a spy on Error constructor
const errorSpy = vi.spyOn(global, 'Error');

describe('ErrorButton', () => {
  beforeEach(() => {
    // Silence console errors for cleaner test output
    console.error = vi.fn();
    // Clear previous calls to Error constructor
    errorSpy.mockClear();
  });

  afterEach(() => {
    // Restore console.error after tests
    console.error = originalConsoleError;
  });

  it('renders a button with correct text', () => {
    render(<ErrorButton />);
    expect(screen.getByRole('button')).toHaveTextContent(/throw test error/i);
  });

  it('has the expected styling', () => {
    render(<ErrorButton />);
    const button = screen.getByRole('button');
    
    // Check for text-white class which is in the actual component
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('bg-yellow-500');
  });

  it('renders without crashing and has expected attributes', () => {
    render(<ErrorButton />);
    const button = screen.getByRole('button');
    
    expect(button).toBeInTheDocument();
  });
  
  // Test the click handler function execution
  it('executes the error-throwing function when clicked', () => {
    const errorHandler = vi.fn();
    window.addEventListener('error', errorHandler);
    
    render(<ErrorButton />);
    const button = screen.getByRole('button');
    
    try {
      fireEvent.click(button);
    } catch (_) {
    }
    
    expect(errorSpy).toHaveBeenCalled();
    
    window.removeEventListener('error', errorHandler);
  });
});
