import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Results from '../components/Results';

const mockNavigate = vi.fn();
const mockSetSearchTerm = vi.fn();

// Create a mock search term state
const mockSearchTerm = { current: '' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../context/SearchContext', () => ({
  useSearch: () => ({
    searchTerm: mockSearchTerm.current,
    setSearchTerm: mockSetSearchTerm,
  }),
  SearchProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('Results', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchTerm.current = '';
  });

  it('shows loader while fetching', () => {
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <Results />
      </BrowserRouter>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('displays pokemon list on successful fetch', async () => {
    const mockData = {
      count: 1,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <BrowserRouter>
        <Results />
      </BrowserRouter>
    );

    await waitFor(
      () => {
        expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('navigates to 404 when pokemon not found', async () => {
    // Set search term to trigger single pokemon fetch
    mockSearchTerm.current = 'nonexistent-pokemon';

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(
      <BrowserRouter>
        <Results />
      </BrowserRouter>
    );

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/404');
      },
      { timeout: 2000 }
    );
  });

  it('shows error message on fetch failure', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(
      <BrowserRouter>
        <Results />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Failed to fetch data. Please try again.')
      ).toBeInTheDocument();
    });
  });
});
