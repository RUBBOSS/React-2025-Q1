import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PokemonCard from './PokemonCard';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { toggleSelection, addPokemonData } from '../redux/slices/selectedPokemonSlice';


vi.mock('../redux/hooks', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(),
}));
vi.mock('../redux/slices/selectedPokemonSlice', () => ({
  toggleSelection: vi.fn(),
  selectIsSelected: vi.fn(),
  addPokemonData: vi.fn(),
}));
describe('PokemonCard', () => {
  const mockDispatch = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);
    vi.mocked(toggleSelection).mockReturnValue({ type: 'selectedPokemon/toggleSelection', payload: 25 });
    vi.mocked(addPokemonData).mockReturnValue({ 
      type: 'selectedPokemon/addPokemonData', 
      payload: { 
        id: 25, 
        name: 'pikachu',
        height: 40,
        weight: 60,
        sprites: { other: { 'official-artwork': { front_default: 'official.png' } } },
        types: [{ type: { name: 'electric' } }],
        stats: [],
        abilities: [],
        species: { name: 'pikachu', url: '' }
      } 
    });
  });
  it('renders the Pokemon name', () => {
    vi.mocked(useAppSelector).mockReturnValue(false);
    render(<PokemonCard 
      id={25} 
      name="pikachu" 
      onSelect={vi.fn()} 
    />);
    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });
  it('uses officialArtwork as image source when available', () => {
    vi.mocked(useAppSelector).mockReturnValue(false);
    render(
      <PokemonCard
        id={25}
        name="pikachu"
        officialArtwork="https://example.com/official.png"
        onSelect={vi.fn()}
      />
    );
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/official.png');
  });
  it('falls back to regular image when officialArtwork is not available', () => {
    vi.mocked(useAppSelector).mockReturnValue(false);
    render(
      <PokemonCard
        id={25}
        name="pikachu"
        image="https://example.com/regular.png"
        onSelect={vi.fn()}
      />
    );
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/regular.png');
  });
  it('falls back to pokeAPI image when no images are provided', () => {
    vi.mocked(useAppSelector).mockReturnValue(false);
    render(<PokemonCard 
      id={25} 
      name="pikachu" 
      onSelect={vi.fn()} 
    />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png');
  });
  it('applies selected styling when Pokemon is selected', () => {
    vi.mocked(useAppSelector).mockReturnValue(true);
    render(<PokemonCard 
      id={25} 
      name="pikachu" 
      onSelect={vi.fn()} 
    />);
    const card = screen.getByText('pikachu').closest('div');
    expect(card).toHaveClass('ring-2');
    expect(card).toHaveClass('ring-blue-500');
  });
  it('calls onSelect when the card is clicked', () => {
    vi.mocked(useAppSelector).mockReturnValue(false);
    const mockOnSelect = vi.fn();
    render(<PokemonCard 
      id={25} 
      name="pikachu" 
      onSelect={mockOnSelect} 
    />);
    const card = screen.getByText('pikachu').closest('div');
    if (card) {
      fireEvent.click(card);
    }
    expect(mockOnSelect).toHaveBeenCalledWith(25);
  });
  it('dispatches toggleSelection when checkbox is clicked', () => {
    vi.mocked(useAppSelector).mockReturnValue(false);
    render(<PokemonCard 
      id={25} 
      name="pikachu" 
      onSelect={vi.fn()} 
    />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, { 
      type: 'selectedPokemon/toggleSelection', 
      payload: 25 
    });
  });
  it('dispatches addPokemonData when unselected Pokemon is selected', () => {
    vi.mocked(useAppSelector).mockReturnValue(false);
    render(<PokemonCard 
      id={25} 
      name="pikachu"
      types={[{ type: { name: 'electric' } }]}
      height={40}
      weight={60}
      officialArtwork="https://example.com/official.png"
      onSelect={vi.fn()} 
    />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenNthCalledWith(2, { 
      type: 'selectedPokemon/addPokemonData',
      payload: expect.any(Object)
    });
  });
  it('does not dispatch addPokemonData when selected Pokemon is unselected', () => {
    vi.mocked(useAppSelector).mockReturnValue(true);
    render(<PokemonCard 
      id={25} 
      name="pikachu" 
      onSelect={vi.fn()} 
    />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockDispatch).toHaveBeenCalledTimes(1); 
    expect(mockDispatch).toHaveBeenCalledWith({ 
      type: 'selectedPokemon/toggleSelection',
      payload: 25
    });
  });
});
