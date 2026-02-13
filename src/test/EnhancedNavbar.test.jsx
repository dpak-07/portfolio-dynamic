import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EnhancedNavbar from '../components/EnhancedNavbar';

describe('EnhancedNavbar', () => {
    it('should render the logo', () => {
        render(
            <BrowserRouter>
                <EnhancedNavbar />
            </BrowserRouter>
        );

        expect(screen.getByText('D')).toBeInTheDocument();
    });

    it('should render all navigation items', () => {
        render(
            <BrowserRouter>
                <EnhancedNavbar />
            </BrowserRouter>
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Tech Stack')).toBeInTheDocument();
        expect(screen.getByText('Projects')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('should render blog link', () => {
        render(
            <BrowserRouter>
                <EnhancedNavbar />
            </BrowserRouter>
        );

        const blogLinks = screen.getAllByText('Blog');
        expect(blogLinks.length).toBeGreaterThan(0);
    });
});
