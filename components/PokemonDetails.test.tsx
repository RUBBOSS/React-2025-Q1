import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import PokemonDetails from './PokemonDetails';

// Mock Image from next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, className, style }: {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <img 
      src={src}
      alt={alt}
      className={className}
      data-testid="mock-image"
      style={style}
    />
  ),
}));

vi.mock('./LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

describe('PokemonDetails', () => {
  const mockPokemonResponse = {
    id: 25,
    name: 'pikachu',
    height: 4,
    weight: 60,
    sprites: {
      front_default: 'https://example.com/pikachu.png',
      back_default: 'https://example.com/pikachu-back.png',
      front_shiny: 'https://example.com/pikachu-shiny.png',
      other: {
        'official-artwork': {
          front_default: 'https://example.com/pikachu-official.png',
        },
      },
    },
    types: [{ type: { name: 'electric' } }],
    abilities: [
      { ability: { name: 'static' }, is_hidden: false },
      { ability: { name: 'lightning-rod' }, is_hidden: true }
    ],
    stats: [
      { base_stat: 35, stat: { name: 'hp' } },
      { base_stat: 55, stat: { name: 'attack' } },
      { base_stat: 40, stat: { name: 'defense' } },
      { base_stat: 50, stat: { name: 'special-attack' } },
      { base_stat: 50, stat: { name: 'special-defense' } },
      { base_stat: 90, stat: { name: 'speed' } }
    ],
    species: {
      url: 'https://pokeapi.co/api/v2/pokemon-species/25',
    },
  };

  const mockSpeciesResponse = {
    flavor_text_entries: [
      { flavor_text: 'Test description\fwith some weird characters', language: { name: 'en' } },
      { flavor_text: 'Another description', language: { name: 'fr' } }
    ],
    genera: [{ genus: 'Mouse Pokémon', language: { name: 'en' } }]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the fetch calls
    global.fetch = vi.fn((url: string) => {
      if (url.includes('/api/pokemon/25')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPokemonResponse)
        });
      } else if (url.includes('/api/pokemon/species/25')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSpeciesResponse)
        });
      } else if (url.includes('/api/pokemon/error')) {
        return Promise.resolve({
          ok: false,
          status: 404,
          statusText: 'Not Found'
        });
      }
      
      return Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });
    }) as unknown as typeof fetch;
  });

  it('shows loading spinner initially', () => {
    render(<PokemonDetails pokemonId={25} onClose={vi.fn()} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders Pokemon details after successful data fetch', async () => {
    render(<PokemonDetails pokemonId={25} onClose={vi.fn()} />);
    
    // Wait for the Pokemon name to appear after loading
    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
    
    // Check that other details are rendered
    expect(screen.getByText('electric')).toBeInTheDocument();
    
    // Use function matchers to find text that might be combined with other text
    expect(screen.getByText((_content, element) => {
      return element?.textContent === '0.4m';
    })).toBeInTheDocument();
    
    expect(screen.getByText((_content, element) => {
      return element?.textContent === '6kg';
    })).toBeInTheDocument();
    
    expect(screen.getByText((_content, element) => {
      return element?.textContent === '#025';
    })).toBeInTheDocument();
    
    // Test for description
    expect(screen.getByText('Test description with some weird characters')).toBeInTheDocument();
    
    // Test for abilities
    expect(screen.getByText('static')).toBeInTheDocument();
    expect(screen.getByText(/lightning rod/)).toBeInTheDocument();
    expect(screen.getByText('(Hidden)')).toBeInTheDocument();
    
    // Test for stats
    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('Attack')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
    
    // Check if image is rendered
    const image = screen.getByTestId('mock-image');
    expect(image).toBeInTheDocument();
    expect(image.getAttribute('src')).toBe('https://example.com/pikachu-official.png');
  });

  it('renders error state when API call fails', async () => {
    render(<PokemonDetails pokemonId="error" onClose={vi.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch Pokemon details/i)).toBeInTheDocument();
    });
    
    // Check for error UI elements
    const goBackButton = screen.getByText(/Go Back/i);
    expect(goBackButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const mockOnClose = vi.fn();
    render(<PokemonDetails pokemonId={25} onClose={mockOnClose} />);
    
    // Wait for the component to fully render
    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
    
    // Find and click the close button
    const closeButton = screen.getByLabelText(/Close details/i);
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when Go Back button is clicked in error state', async () => {
    const mockOnClose = vi.fn();
    render(<PokemonDetails pokemonId="error" onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch Pokemon details/i)).toBeInTheDocument();
    });
    
    // Find and click the Go Back button
    const goBackButton = screen.getByText(/Go Back/i);
    fireEvent.click(goBackButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('formats stat names correctly', async () => {
    render(<PokemonDetails pokemonId={25} onClose={vi.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
    
    // Check special stat formatting
    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('Sp. Atk')).toBeInTheDocument();
    expect(screen.getByText('Sp. Def')).toBeInTheDocument();
    expect(screen.getByText('Speed')).toBeInTheDocument();
  });

  it('handles missing description gracefully', async () => {
    // Modify the mock for this specific test
    global.fetch = vi.fn((url: string) => {
      if (url.includes('/api/pokemon/25')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPokemonResponse)
        });
      } else if (url.includes('/api/pokemon/species/25')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            flavor_text_entries: [
              { flavor_text: 'Non-English description', language: { name: 'fr' } }
            ]
          })
        });
      }
      
      return Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });
    }) as unknown as typeof fetch;
    
    render(<PokemonDetails pokemonId={25} onClose={vi.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
    
    // The description section should not be present
    expect(screen.queryByText('Description')).not.toBeInTheDocument();
  });

  it('applies correct type colors to type badges', async () => {
    render(<PokemonDetails pokemonId={25} onClose={vi.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
    
    const typeBadge = screen.getByText('electric');
    expect(typeBadge).toHaveStyle({ backgroundColor: '#F7D02C' }); // Electric type color
  });
  
  it('handles fetch error for species data gracefully', async () => {
    // Modify the mock for this specific test
    global.fetch = vi.fn((url: string) => {
      if (url.includes('/api/pokemon/25')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPokemonResponse)
        });
      } else if (url.includes('/api/pokemon/species/25')) {
        return Promise.resolve({
          ok: false,
          status: 404,
          statusText: 'Not Found'
        });
      }
      
      return Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });
    }) as unknown as typeof fetch;
    
    render(<PokemonDetails pokemonId={25} onClose={vi.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
    
    // The component should still render without the description
    expect(screen.queryByText('Description')).not.toBeInTheDocument();
  });
});
