import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';
import { FallbackProps } from 'react-error-boundary';

describe('ErrorBoundary', () => {
  it('displays error message when error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent('Test error');
  });

  it('calls resetErrorState when close button is clicked', () => {
    const resetErrorState = vi.fn();
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary resetErrorState={resetErrorState}>
        <ThrowError />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Close'));
    expect(resetErrorState).toHaveBeenCalled();
  });

  it('handles errors and displays error UI', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(container.textContent).toContain('Something went wrong');
  });

  it('handles reset functionality', () => {
    const resetErrorState = vi.fn();
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary resetErrorState={resetErrorState}>
        <ThrowError />
      </ErrorBoundary>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(resetErrorState).toHaveBeenCalled();
  });

  it('handles componentDidCatch lifecycle', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const error = new Error('Test error');

    const ThrowError = () => {
      throw error;
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('resets error state on unmount', () => {
    const resetErrorState = vi.fn();
    const { unmount } = render(
      <ErrorBoundary resetErrorState={resetErrorState}>
        <div>Content</div>
      </ErrorBoundary>
    );

    unmount();
    expect(resetErrorState).toHaveBeenCalled();
  });

  it('renders custom FallbackComponent when provided', () => {
    const CustomFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
      <div>
        <span>Custom Error: {error.message}</span>
        <button onClick={resetErrorBoundary}>Reset</button>
      </div>
    );

    const ThrowError = () => {
      throw new Error('Custom error');
    };

    render(
      <ErrorBoundary FallbackComponent={CustomFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Custom Error:/)).toBeInTheDocument();
  });

  it('cleans up state on reset', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('error-message')).toHaveTextContent('Test error');

    act(() => {
      rerender(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      );
    });

    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });
});
