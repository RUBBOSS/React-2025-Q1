import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchProvider } from '../context/SearchContext';
import NotFound from '../components/NotFound';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('NotFound', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <SearchProvider>
          <NotFound />
        </SearchProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(
      screen.getByText('Oops! Looks like this area is unexplored!')
    ).toBeInTheDocument();
  });

  it('navigates home when clicking return button', () => {
    render(
      <BrowserRouter>
        <SearchProvider>
          <NotFound />
        </SearchProvider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Return to Home'));
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });
});
