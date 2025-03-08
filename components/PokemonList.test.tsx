import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PokemonList from './PokemonList';
import { Pokemon } from '../types/pokemon';
import type { PokemonCardProps } from './PokemonCard';

vi.mock('./PokemonCard', () => ({
  default: ({
    pokemon,
    isSelected = false,
    isCompact = false,
    isChecked = false,
  }: PokemonCardProps) => (
    <div
      data-testid={`pokemon-card-${pokemon.id}`}
      data-selected={isSelected}
      data-compact={isCompact}
      data-checked={isChecked}
    >
      {pokemon.name}
    </div>
  ),
}));

describe('PokemonList', () => {
  const mockPokemon: Pokemon[] = [
    {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      stats: [],
      abilities: [],
      sprites: {
        front_default: 'bulbasaur.png',
        other: {
          'official-artwork': {
            front_default: 'bulbasaur-official.png',
          },
        },
      },
      species: {
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
      },
      officialArtwork: 'bulbasaur-official.png',
    },
    {
      id: 2,
      name: 'ivysaur',
      height: 10,
      weight: 130,
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      stats: [],
      abilities: [],
      sprites: {
        front_default: 'ivysaur.png',
        other: {
          'official-artwork': {
            front_default: 'ivysaur-official.png',
          },
        },
      },
      species: {
        name: 'ivysaur',
        url: 'https://pokeapi.co/api/v2/pokemon-species/2/',
      },
      officialArtwork: 'ivysaur-official.png',
    },
    {
      id: 3,
      name: 'venusaur',
      height: 20,
      weight: 1000,
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      stats: [],
      abilities: [],
      sprites: {
        front_default: 'venusaur.png',
        other: {
          'official-artwork': {
            front_default: 'venusaur-official.png',
          },
        },
      },
      species: {
        name: 'venusaur',
        url: 'https://pokeapi.co/api/v2/pokemon-species/3/',
      },
      officialArtwork: 'venusaur-official.png',
    },
  ];

  it('renders empty state when no Pokemon are provided', () => {
    render(<PokemonList pokemonData={[]} onSelectPokemon={vi.fn()} />);
    expect(
      screen.getByText('No Pokemon found. Try a different search term.')
    ).toBeInTheDocument();
  });

  it('renders Pokemon cards for each Pokemon', () => {
    render(<PokemonList pokemonData={mockPokemon} onSelectPokemon={vi.fn()} />);
    expect(screen.getByTestId('pokemon-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-card-3')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
    expect(screen.getByText('venusaur')).toBeInTheDocument();
  });

  it('limits the displayed Pokemon to 9', () => {
    const manyPokemon = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `pokemon-${i + 1}`,
      height: 10,
      weight: 100,
      types: [{ type: { name: 'normal' } }],
      stats: [],
      abilities: [],
      sprites: {
        front_default: `image-${i + 1}.png`,
        other: {
          'official-artwork': {
            front_default: `official-${i + 1}.png`,
          },
        },
      },
      species: {
        name: `pokemon-${i + 1}`,
        url: `https://pokeapi.co/api/v2/pokemon-species/${i + 1}/`,
      },
      officialArtwork: `official-${i + 1}.png`,
    }));
    render(<PokemonList pokemonData={manyPokemon} onSelectPokemon={vi.fn()} />);
    expect(screen.getByTestId('pokemon-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-card-9')).toBeInTheDocument();
    expect(screen.queryByTestId('pokemon-card-10')).not.toBeInTheDocument();
  });
});
