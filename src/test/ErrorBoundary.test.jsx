import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

// Component that throws an error
const ThrowError = () => {
    throw new Error('Test error');
};

// Component that works fine
const WorkingComponent = () => <div>Working Component</div>;

describe('ErrorBoundary', () => {
    it('should render children when there is no error', () => {
        render(
            <ErrorBoundary>
                <WorkingComponent />
            </ErrorBoundary>
        );

        expect(screen.getByText('Working Component')).toBeInTheDocument();
    });

    it('should render error UI when child component throws', () => {
        // Suppress console.error for this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByText(/Oops! Something went wrong/i)).toBeInTheDocument();
        expect(screen.getByText(/Reload Page/i)).toBeInTheDocument();

        consoleSpy.mockRestore();
    });
});
