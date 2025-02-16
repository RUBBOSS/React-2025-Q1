import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../testUtils';
import Results from '../components/Results';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
    useNavigate: () => vi.fn(),
  };
});

describe('Results', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state', () => {
    renderWithProviders(<Results />, {
      preloadedState: {
        pokemon: {
          items: [],
          loading: true,
          error: null,
          currentPage: 1,
          totalPages: 1,
          searchTerm: '',
          selectedItems: [],
        },
      },
    });
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('shows error message', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));

    renderWithProviders(<Results />, {
      preloadedState: {
        pokemon: {
          items: [],
          loading: false,
          error: 'Failed to fetch',
          currentPage: 1,
          totalPages: 1,
          searchTerm: '',
          selectedItems: [],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });
  });

  it('shows empty state', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [], count: 0 }),
    });

    renderWithProviders(<Results />, {
      preloadedState: {
        pokemon: {
          items: [],
          loading: false,
          error: null,
          currentPage: 1,
          totalPages: 1,
          searchTerm: 'nonexistent',
          selectedItems: [],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/no pokémon/i)).toBeInTheDocument();
    });
  });

  it('renders pokemon items', async () => {
    const mockResponse = {
      count: 1,
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      ],
    };

    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    renderWithProviders(<Results />, {
      preloadedState: {
        pokemon: {
          items: [
            { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
          ],
          loading: false,
          error: null,
          currentPage: 1,
          totalPages: 1,
          searchTerm: '',
          selectedItems: [],
        },
      },
    });

    await waitFor(() => {
      expect(screen.queryByText(/no pokémon/i)).not.toBeInTheDocument();
    });

    const pokemonElement = await screen.findByText(/pikachu/i);
    expect(pokemonElement).toBeInTheDocument();

    expect(fetch).toHaveBeenCalled();
  });
});
