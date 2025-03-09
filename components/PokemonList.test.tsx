import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, render, within } from '@testing-library/react';
import { Pokemon } from '../types/pokemon';
import React from 'react';
import PokemonList from './PokemonList';

vi.mock('./PokemonCard', () => {
  return {
    default: ({ pokemon, onSelect, isSelected, isCompact, onCheckboxChange, isChecked }: {
      pokemon: Pokemon;
      onSelect: (id: number) => void;
      isSelected: boolean;
      isCompact?: boolean;
      onCheckboxChange: (id: number, checked: boolean) => void;
      isChecked: boolean;
    }) => {
      const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onCheckboxChange(pokemon.id, e.target.checked);
      };

      return (
        <div 
          data-testid={`pokemon-card-${pokemon.id}`}
          data-pokemon-id={pokemon.id}
          data-selected={isSelected}
          data-compact={isCompact}
          data-checked={isChecked}
          onClick={() => onSelect(pokemon.id)}
          className="mock-pokemon-card"
        >
          <span>{pokemon.name}</span>
          <input 
            type="checkbox" 
            data-testid={`checkbox-${pokemon.id}`}
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </div>
      );
    }
  };
});

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
  });
  
  it('calls onSelectPokemon when a card is clicked', () => {
    const mockSelectPokemon = vi.fn();
    render(<PokemonList pokemonData={mockPokemon} onSelectPokemon={mockSelectPokemon} />);
    
    fireEvent.click(screen.getByTestId('pokemon-card-1'));
    expect(mockSelectPokemon).toHaveBeenCalledWith(1);
  });

  it('passes selectedId to determine which card is selected', () => {
    render(<PokemonList pokemonData={mockPokemon} onSelectPokemon={vi.fn()} selectedId={2} />);
    
    expect(screen.getByTestId('pokemon-card-1').dataset.selected).toBe('false');
    expect(screen.getByTestId('pokemon-card-2').dataset.selected).toBe('true');
    expect(screen.getByTestId('pokemon-card-3').dataset.selected).toBe('false');
  });

  it('passes compact prop to cards', () => {
    render(<PokemonList pokemonData={mockPokemon} onSelectPokemon={vi.fn()} compact={true} />);
    
    expect(screen.getByTestId('pokemon-card-1').dataset.compact).toBe('true');
    expect(screen.getByTestId('pokemon-card-2').dataset.compact).toBe('true');
    expect(screen.getByTestId('pokemon-card-3').dataset.compact).toBe('true');
  });

  it('uses internal state for checkbox selection when no selectedIds prop', async () => {
    const { rerender } = render(<PokemonList pokemonData={mockPokemon} onSelectPokemon={vi.fn()} />);
    
    // Initially no checkboxes are checked
    expect(screen.getByTestId('checkbox-1')).not.toBeChecked();
    
    // Click the checkbox - this should update the internal state
    fireEvent.click(screen.getByTestId('checkbox-1'));
    
    // Force a rerender to see updated state
    rerender(<PokemonList pokemonData={mockPokemon} onSelectPokemon={vi.fn()} />);
    
    // Verify selection summary exists
    const selectionText = await screen.findByText(/1 pokemon selected/i);
    expect(selectionText).toBeInTheDocument();
  });

  it('uses external state for checkbox selection when selectedIds prop is provided', () => {
    const mockOnCheckboxChange = vi.fn();
    render(
      <PokemonList 
        pokemonData={mockPokemon} 
        onSelectPokemon={vi.fn()} 
        selectedIds={[1]} 
        onCheckboxChange={mockOnCheckboxChange} 
      />
    );
    
    // First checkbox should be checked based on selectedIds
    expect(screen.getByTestId('checkbox-1')).toBeChecked();
    expect(screen.getByTestId('checkbox-2')).not.toBeChecked();
    
    // Click the second checkbox
    fireEvent.click(screen.getByTestId('checkbox-2'));
    
    // The callback should be called with the id and true
    expect(mockOnCheckboxChange).toHaveBeenCalledWith(2, true);
  });

  it('shows selection summary when pokemon are selected', () => {
    render(
      <PokemonList 
        pokemonData={mockPokemon} 
        onSelectPokemon={vi.fn()} 
        selectedIds={[1, 3]} 
      />
    );
    
    // Check for summary text by regex to handle case insensitivity
    const selectionText = screen.getByText(/2 pokemon selected/i);
    expect(selectionText).toBeInTheDocument();
    
    // Find buttons within summary
    const summaryContainer = selectionText.closest('div');
    if (!summaryContainer) {
      throw new Error('Summary container not found');
    }
    const compareButton = within(summaryContainer).getByText(/compare/i);
    const clearButton = within(summaryContainer).getByText(/clear/i);
    
    expect(compareButton).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
  });

  it('clears internal selection when Clear button is clicked', async () => {
    // Render with initial state
    const { rerender } = render(<PokemonList pokemonData={mockPokemon} onSelectPokemon={vi.fn()} />);
    
    // Check checkbox to set internal selection
    fireEvent.click(screen.getByTestId('checkbox-1'));
    fireEvent.click(screen.getByTestId('checkbox-2'));
    
    // Force rerender to show updated state
    rerender(<PokemonList pokemonData={mockPokemon} onSelectPokemon={vi.fn()} />);
    
    // Find selection summary and clear button
    const selectionText = await screen.findByText(/2 pokemon selected/i);
    const summaryContainer = selectionText.closest('div');
    if (!summaryContainer) {
      throw new Error('Summary container not found');
    }
    const clearButton = within(summaryContainer).getByText(/clear/i);
    
    // Click clear button
    fireEvent.click(clearButton);
    
    // Force another rerender
    rerender(<PokemonList pokemonData={mockPokemon} onSelectPokemon={vi.fn()} />);
    
    // Selection should be cleared
    expect(screen.queryByText(/pokemon selected/i)).not.toBeInTheDocument();
  });

  it('calls external onCheckboxChange with false for all selectedIds when Clear button is clicked', () => {
    const mockOnCheckboxChange = vi.fn();
    render(
      <PokemonList 
        pokemonData={mockPokemon} 
        onSelectPokemon={vi.fn()} 
        selectedIds={[1, 2]} 
        onCheckboxChange={mockOnCheckboxChange} 
      />
    );
    
    // Find and click clear button
    const selectionText = screen.getByText(/2 pokemon selected/i);
    const summaryContainer = selectionText.closest('div');
    if (!summaryContainer) {
      throw new Error('Summary container not found');
    }
    const clearButton = within(summaryContainer).getByText(/clear/i);
    fireEvent.click(clearButton);
    
    // Should call onCheckboxChange for each selected id
    expect(mockOnCheckboxChange).toHaveBeenCalledWith(1, false);
    expect(mockOnCheckboxChange).toHaveBeenCalledWith(2, false);
  });

  it('logs selection when Compare button is clicked', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(
      <PokemonList 
        pokemonData={mockPokemon} 
        onSelectPokemon={vi.fn()} 
        selectedIds={[1, 3]} 
      />
    );
    
    // Find and click compare button
    const selectionText = screen.getByText(/2 pokemon selected/i);
    const summaryContainer = selectionText.closest('div');
    if (!summaryContainer) {
      throw new Error('Summary container not found');
    }
    const compareButton = within(summaryContainer).getByText(/compare/i);
    fireEvent.click(compareButton);
    
    // Should log the selected ids
    expect(consoleSpy).toHaveBeenCalledWith('Selected for comparison:', [1, 3]);
    
    consoleSpy.mockRestore();
  });

  it('applies compact grid layout when compact prop is true', () => {
    const { container } = render(
      <PokemonList 
        pokemonData={mockPokemon} 
        onSelectPokemon={vi.fn()} 
        compact={true} 
      />
    );
    
    const gridDiv = container.querySelector('div[class*="grid"]');
    expect(gridDiv?.className).toContain('grid-cols-1 gap-4');
    expect(gridDiv?.className).toContain('sm:grid-cols-2');
    expect(gridDiv?.className).toContain('lg:grid-cols-2');
    expect(gridDiv?.className).toContain('xl:grid-cols-2');
  });

  it('applies standard grid layout when compact prop is false', () => {
    const { container } = render(
      <PokemonList 
        pokemonData={mockPokemon} 
        onSelectPokemon={vi.fn()} 
      />
    );
    
    const gridDiv = container.querySelector('div[class*="grid"]');
    expect(gridDiv?.className).toContain('grid-cols-1 gap-6');
    expect(gridDiv?.className).toContain('sm:grid-cols-2');
    expect(gridDiv?.className).toContain('lg:grid-cols-3');
  });
});