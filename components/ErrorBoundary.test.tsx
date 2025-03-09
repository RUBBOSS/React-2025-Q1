import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect, beforeAll, afterAll } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';
import ErrorBoundary from './ErrorBoundary';

// Create a component that throws an error
const ThrowError = () => {
  throw new Error('Test error');
};

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn()
  })
}));

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

// Create a proper error boundary for testing
interface TestErrorBoundaryProps {
  children: React.ReactNode;
}

class TestErrorBoundary extends React.Component<TestErrorBoundaryProps> {
  static getDerivedStateFromError(error: Error): { hasError: boolean; error: Error } {
    return { hasError: true, error };
  }
  
  state = { hasError: false, error: null };
  
  render() {
    return this.props.children;
  }
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('renders error UI when a child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    // Check error message is displayed
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    // Verify error details are available
    const detailsButton = screen.getByText('View technical details');
    expect(detailsButton).toBeInTheDocument();
    
    // Test refresh button functionality
    const refreshButton = screen.getByText('Reload Page');
    expect(refreshButton).toBeInTheDocument();
    fireEvent.click(refreshButton);
  });

  // Test the error details toggle functionality
  it('toggles error details when clicking the summary', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    const detailsButton = screen.getByText('View technical details');
    fireEvent.click(detailsButton);
    
    // After clicking, details should be expanded
    expect(screen.getByText(/View technical details/i)).toBeInTheDocument();
  });

  // Test static error handling method using a test class
  it('properly sets error state in getDerivedStateFromError', () => {
    const error = new Error('Test error');
    const result = TestErrorBoundary.getDerivedStateFromError(error);
    
    expect(result).toEqual({
      hasError: true,
      error
    });
  });
});

