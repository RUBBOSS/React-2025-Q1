import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PokemonDetails from './PokemonDetails';

// Mock Pokemon response with complete data structure
const mockPokemonResponse = {
  id: 25,
  name: 'pikachu',
  height: 40,
  weight: 60,
  sprites: {
    front_default: 'https://example.com/pikachu.png',
    other: {
      'official-artwork': {
        front_default: 'https://example.com/pikachu-official.png'
      }
    }
  },
  types: [{ type: { name: 'electric' } }],
  abilities: [{ ability: { name: 'static' } }],
  stats: [{ base_stat: 55, stat: { name: 'attack' } }],
  species: { 
    name: 'pikachu',
    url: 'https://pokeapi.co/api/v2/pokemon-species/25'
  }
};

// Mock species response with all required fields
const mockSpeciesResponse = {
  flavor_text_entries: [
    { 
      flavor_text: 'This is a description.',
      language: { name: 'en' }
    }
  ],
  genera: [
    {
      genus: 'Mouse Pokemon',
      language: { name: 'en' }
    }
  ],
  names: [
    {
      name: 'Pikachu',
      language: { name: 'en' }
    }
  ]
};

// Type-safe fetch mock
const createFetchResponse = (data: unknown) => Promise.resolve({
  ok: true,
  json: () => Promise.resolve(data)
} as Response);

// Setup base fetch mock
global.fetch = vi.fn().mockImplementation((url: string | URL | Request) => {
  const urlString = url.toString();
  return createFetchResponse(
    urlString.includes('pokemon-species') ? mockSpeciesResponse : mockPokemonResponse
  );
}) as unknown as typeof global.fetch;

vi.mock('./LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

describe('PokemonDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock to default behavior
    vi.mocked(fetch).mockImplementation((url: string | URL | Request) => {
      const urlString = url.toString();
      return createFetchResponse(
        urlString.includes('pokemon-species') ? mockSpeciesResponse : mockPokemonResponse
      );
    });
  });

  it('shows loading spinner initially', () => {
    vi.mocked(fetch).mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({}),
              } as Response),
            100
          )
        )
    );
    render(<PokemonDetails pokemonId={1} onClose={vi.fn()} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders pokemon details after successful data fetch', async () => {
    render(<PokemonDetails pokemonId={25} onClose={() => {}} />);
    
    await waitFor(() => {
      expect(screen.getByAltText('pikachu')).toBeInTheDocument();
      expect(screen.getByText('Pokemon Details')).toBeInTheDocument();
    });
  });

  it('renders pokemon details after successful data fetch', async () => {
    const mockPokemonData = {
      ...mockPokemonResponse,
      sprites: {
        front_default: 'https://example.com/pikachu.png',
        other: {
          'official-artwork': {
            front_default: 'https://example.com/pikachu-official.png'
          }
        }
      }
    };

    const mockSpeciesData = {
      ...mockSpeciesResponse
    };

    vi.mocked(fetch).mockImplementation((url: string | URL | Request) => {
      const urlString = url.toString();
      return createFetchResponse(
        urlString.includes('pokemon-species') ? mockSpeciesData : mockPokemonData
      );
    });

    render(<PokemonDetails pokemonId={25} onClose={vi.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByAltText('pikachu')).toBeInTheDocument();
    });

    expect(screen.getByText('4m')).toBeInTheDocument();
    expect(screen.getByText('6kg')).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();
    expect(screen.getByText('static')).toBeInTheDocument();
    expect(screen.getByText('attack')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
    expect(screen.getByText('This is a description.')).toBeInTheDocument();
  });

  it('renders error message on fetch failure', async () => {
    vi.mocked(fetch).mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      } as Response)
    );
    render(<PokemonDetails pokemonId={9999} onClose={vi.fn()} />);
    await waitFor(() => {
      expect(
        screen.getByText('Failed to fetch Pokemon details')
      ).toBeInTheDocument();
    });
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const mockPokemonData = {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      types: [{ type: { name: 'grass' } }],
      abilities: [{ ability: { name: 'overgrow' } }],
      stats: [],
      sprites: {
        front_default: 'bulbasaur.png',
        other: {
          'official-artwork': { front_default: 'bulbasaur-official.png' },
        },
      },
      species: { url: 'https://pokeapi.co/api/v2/pokemon-species/1' },
    };
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonData),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ flavor_text_entries: [] }),
      } as Response);
    const mockOnClose = vi.fn();
    render(<PokemonDetails pokemonId={1} onClose={mockOnClose} />);
    await waitFor(() => {
      expect(screen.getByText('Pokemon Details')).toBeInTheDocument();
    });
    const closeButton = screen.getByLabelText('Close details');
    closeButton.click();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
