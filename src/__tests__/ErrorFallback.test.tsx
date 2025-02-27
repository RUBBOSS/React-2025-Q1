import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorFallback from '../components/ErrorFallback';

describe('ErrorFallback', () => {
  it('renders error message', () => {
    render(
      <ErrorFallback
        error={{ message: 'Test error' }}
        resetErrorBoundary={() => {}}
      />
    );
    expect(screen.getByText(/test error/i)).toBeInTheDocument();
  });
});
