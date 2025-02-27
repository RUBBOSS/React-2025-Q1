import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchProvider } from '../context/SearchContext';
import Search from '../components/Search';

const mockSetSearchParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams(), mockSetSearchParams],
  };
});

vi.mock('../context/SearchContext', () => ({
  useSearch: () => ({
    searchTerm: '',
    setSearchTerm: vi.fn(),
  }),
  SearchProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('Search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders search input and button', () => {
    render(
      <BrowserRouter>
        <SearchProvider>
          <Search />
        </SearchProvider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Search Pokémon')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('updates input value on change', async () => {
    render(
      <BrowserRouter>
        <SearchProvider>
          <Search />
        </SearchProvider>
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(
      'Search Pokémon'
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'pikachu' } });
    expect(input.value).toBe('pikachu');
  });

  it('handles search submission', async () => {
    render(
      <BrowserRouter>
        <SearchProvider>
          <Search />
        </SearchProvider>
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/search pokémon/i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'pikachu' } });
    await waitFor(() => {
      fireEvent.click(button);
      expect(mockSetSearchParams).toHaveBeenCalled();
    });
  });

  it('handles empty search', () => {
    render(
      <BrowserRouter>
        <SearchProvider>
          <Search />
        </SearchProvider>
      </BrowserRouter>
    );

    const button = screen.getByText('Search');
    fireEvent.click(button);

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('saves search term to localStorage', () => {
    render(
      <BrowserRouter>
        <SearchProvider>
          <Search />
        </SearchProvider>
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Search Pokémon');
    const button = screen.getByText('Search');

    fireEvent.change(input, { target: { value: 'pikachu' } });
    fireEvent.click(button);

    expect(localStorage.getItem('searchTerm')).toBe('pikachu');
  });

  it('loads previous search term from localStorage', async () => {
    const searchTerm = 'charizard';
    localStorage.setItem('searchTerm', searchTerm);
    vi.resetModules();
    const { default: Search } = await import('../components/Search');
    render(
      <BrowserRouter>
        <SearchProvider>
          <Search />
        </SearchProvider>
      </BrowserRouter>
    );
    await waitFor(() => {
      const input = screen.getByPlaceholderText(
        'Search Pokémon'
      ) as HTMLInputElement;
      expect(input.value).toBe(searchTerm);
    });
  });

  it('handles empty search', async () => {
    render(
      <BrowserRouter>
        <SearchProvider>
          <Search />
        </SearchProvider>
      </BrowserRouter>
    );
    const input = screen.getByPlaceholderText(/search pokémon/i);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByText(/search/i));
    await waitFor(() => {
      expect(screen.queryByText(/no results found/i)).not.toBeInTheDocument();
    });
  });

  it('persists search term to local storage', () => {
    render(
      <BrowserRouter>
        <SearchProvider>
          <Search />
        </SearchProvider>
      </BrowserRouter>
    );
    const input = screen.getByPlaceholderText(/search pokémon/i);
    fireEvent.change(input, { target: { value: 'pikachu' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('searchTerm')).toBe('pikachu');
  });

  it('loads search term from local storage', () => {
    localStorage.setItem('searchTerm', 'charizard');
    render(
      <BrowserRouter>
        <SearchProvider>
          <Search />
        </SearchProvider>
      </BrowserRouter>
    );
    const input = screen.getByPlaceholderText(/search pokémon/i);
    expect(input).toHaveValue('charizard');
  });

  it('updates search value on input', () => {
    render(
      <SearchProvider>
        <Search />
      </SearchProvider>
    );

    const input = screen.getByPlaceholderText(/search pokémon/i);
    fireEvent.change(input, { target: { value: 'pikachu' } });
    expect(input).toHaveValue('pikachu');
  });
});
