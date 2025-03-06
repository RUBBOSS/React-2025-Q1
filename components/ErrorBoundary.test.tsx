import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
describe('ErrorBoundary', () => {
    const originalConsoleError = console.error;
    beforeEach(() => {
        console.error = vi.fn();
    });
    afterEach(() => {
        console.error = originalConsoleError;
    });
    it('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <div data-testid="child">Test Child</div>
            </ErrorBoundary>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });
    it('renders error UI when a child component throws', () => {
        const ThrowingComponent = () => {
            throw new Error('Test error');
        };
        render(
            <ErrorBoundary>
                <ThrowingComponent />
            </ErrorBoundary>
        );
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Test error')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
    it('resets the error state when "Try Again" is clicked', () => {
        let shouldThrow = true;
        const MaybeThrowing = () => {
            if (shouldThrow) {
                throw new Error('Test error');
            }
            return <div data-testid="recovered">Recovered!</div>;
        };
        render(
            <ErrorBoundary>
                <MaybeThrowing />
            </ErrorBoundary>
        );
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        shouldThrow = false;
        fireEvent.click(screen.getByText('Try Again'));
        expect(screen.getByTestId('recovered')).toBeInTheDocument();
        expect(screen.getByText('Recovered!')).toBeInTheDocument();
    });
});
