import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchProvider } from '../context/SearchContext';
import NotFound from '../components/NotFound';

const renderWithProviders = () => {
  return render(
    <BrowserRouter>
      <SearchProvider>
        <NotFound />
      </SearchProvider>
    </BrowserRouter>
  );
};

describe('NotFound', () => {
  it('renders 404 message', () => {
    renderWithProviders();
    expect(screen.getByText(/404/)).toBeInTheDocument();
    expect(screen.getByTestId('404-page')).toBeInTheDocument();
  });

  it('clears search term when clicking return button', () => {
    localStorage.setItem('searchTerm', 'test');
    renderWithProviders();

    fireEvent.click(screen.getByText(/Return to Home/));
    expect(localStorage.getItem('searchTerm')).toBeNull();
  });
});

describe('NotFound Component', () => {
  it('renders not found message', () => {
    render(
      <BrowserRouter>
        <SearchProvider>
          <NotFound />
        </SearchProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/unexplored/i)).toBeInTheDocument();
  });
});
