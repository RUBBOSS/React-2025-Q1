import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PokemonList from './PokemonList';
import { Pokemon } from '../types/pokemon';
vi.mock('./PokemonCard', () => ({
  default: ({ id, name }: { id: number; name: string }) => (
    <div data-testid={`pokemon-card-${id}`}>
      {name}
    </div>
  )
}));
describe('PokemonList', () => {
  const mockPokemon: Pokemon[] = [
    { id: 1, name: 'bulbasaur', image: 'bulbasaur.png', types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }], height: 7, weight: 69, officialArtwork: 'bulbasaur-official.png' },
    { id: 2, name: 'ivysaur', image: 'ivysaur.png', types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }], height: 10, weight: 130, officialArtwork: 'ivysaur-official.png' },
    { id: 3, name: 'venusaur', image: 'venusaur.png', types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }], height: 20, weight: 1000, officialArtwork: 'venusaur-official.png' }
  ];
  it('renders empty state when no Pokemon are provided', () => {
    render(<PokemonList pokemonData={[]} onSelectPokemon={vi.fn()} />);
    expect(screen.getByText('No Pokemon found. Try a different search term.')).toBeInTheDocument();
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
      image: `image-${i + 1}.png`,
      types: [{ type: { name: 'normal' } }],
      height: 10,
      weight: 100,
      officialArtwork: `official-${i + 1}.png`
    }));
    render(<PokemonList pokemonData={manyPokemon} onSelectPokemon={vi.fn()} />);
    expect(screen.getByTestId('pokemon-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-card-9')).toBeInTheDocument();
    expect(screen.queryByTestId('pokemon-card-10')).not.toBeInTheDocument();
  });
});
