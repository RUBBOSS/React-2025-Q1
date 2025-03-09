/* eslint-disable @next/next/no-img-element */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PokemonCard from './PokemonCard';

// Mock the Next.js Image component
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    className,
    style,
  }: {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      data-testid="mock-image"
    />
  ),
}));

describe('PokemonCard', () => {
  const mockPokemon = {
    id: 25,
    name: 'pikachu',
    types: [{ type: { name: 'electric' } }],
    sprites: {
      other: {
        'official-artwork': {
          front_default: 'https://example.com/pikachu-official.png',
        },
      },
      front_default: 'https://example.com/regular.png',
    },
    height: 40,
    weight: 60,
    stats: [],
    abilities: [],
    species: { name: 'pikachu', url: 'https://example.com/species/pikachu' },
  };

  // Corrected structure - need official-artwork key with null/undefined front_default
  const mockPokemonNoOfficialArtwork = {
    id: 999,
    name: 'missingno',
    types: [{ type: { name: 'normal' } }],
    sprites: {
      front_default: 'https://example.com/fallback.png',
      other: {
        'official-artwork': {
          front_default: undefined,
        },
      },
    },
    height: 0,
    weight: 0,
    stats: [],
    abilities: [],
    species: { name: 'unknown', url: 'https://example.com/species/unknown' },
  };

  // Corrected structure for no images
  const mockPokemonNoImages = {
    id: 1000,
    name: 'noimage',
    types: [{ type: { name: 'ghost' } }],
    sprites: {
      front_default: undefined,
      other: {
        'official-artwork': {
          front_default: undefined,
        },
      },
    },
    height: 0,
    weight: 0,
    stats: [],
    abilities: [],
    species: { name: 'unknown', url: 'https://example.com/species/unknown' },
  };

  it('renders the pokemon name correctly', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        onSelect={vi.fn()}
        isSelected={false}
        isCompact={false}
        onCheckboxChange={vi.fn()}
        isChecked={false}
      />
    );

    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });

  it('uses official artwork as image source when available', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        onSelect={vi.fn()}
        isSelected={false}
        isCompact={false}
        onCheckboxChange={vi.fn()}
        isChecked={false}
      />
    );
    
    const image = screen.getByTestId('mock-image');
    expect(image.getAttribute('src')).toBe('https://example.com/pikachu-official.png');
  });

  it('uses front_default when official artwork is not available', () => {
    render(
      <PokemonCard
        pokemon={mockPokemonNoOfficialArtwork}
        onSelect={vi.fn()}
        isSelected={false}
        isCompact={false}
        onCheckboxChange={vi.fn()}
        isChecked={false}
      />
    );
    
    const image = screen.getByTestId('mock-image');
    expect(image.getAttribute('src')).toBe('https://example.com/fallback.png');
  });

  it('uses placeholder when no images are available', () => {
    render(
      <PokemonCard
        pokemon={mockPokemonNoImages}
        onSelect={vi.fn()}
        isSelected={false}
        isCompact={false}
        onCheckboxChange={vi.fn()}
        isChecked={false}
      />
    );
    
    const image = screen.getByTestId('mock-image');
    expect(image.getAttribute('src')).toBe('/placeholder-pokemon.png');
  });

  it('calls onSelect when card is clicked', () => {
    const mockSelect = vi.fn();
    
    render(
      <PokemonCard
        pokemon={mockPokemon}
        onSelect={mockSelect}
        isSelected={false}
        isCompact={false}
        onCheckboxChange={vi.fn()}
        isChecked={false}
      />
    );

    // Find the outer container div and click it
    const card = screen.getByText('pikachu').closest('div[class*="cursor-pointer"]');
    // Add a null check before firing the event
    if (card) {
      fireEvent.click(card);
      expect(mockSelect).toHaveBeenCalledWith(25);
    } else {
      throw new Error("Could not find clickable card element");
    }
  });

  it('applies selected styles when isSelected is true', () => {
    const { container } = render(
      <PokemonCard
        pokemon={mockPokemon}
        onSelect={vi.fn()}
        isSelected={true}
        isCompact={false}
        onCheckboxChange={vi.fn()}
        isChecked={false}
      />
    );
    
    // Looking for a div with both ring-2 and ring-blue-500 classes
    const selectedCard = container.querySelector('div[class*="ring-2"][class*="ring-blue-500"]');
    expect(selectedCard).not.toBeNull();
  });

  it('renders in compact mode when isCompact is true', () => {
    const { container } = render(
      <PokemonCard
        pokemon={mockPokemon}
        onSelect={vi.fn()}
        isSelected={false}
        isCompact={true}
        onCheckboxChange={vi.fn()}
        isChecked={false}
      />
    );
    
    // In compact mode, we should have a div with "flex items-center" class
    expect(container.querySelector('div[class*="flex items-center"]')).not.toBeNull();
  });

  it('renders in standard mode when isCompact is false', () => {
    const { container } = render(
      <PokemonCard
        pokemon={mockPokemon}
        onSelect={vi.fn()}
        isSelected={false}
        isCompact={false}
        onCheckboxChange={vi.fn()}
        isChecked={false}
      />
    );
    
    // In standard mode, we should have a div with "flex flex-col items-center" class
    expect(container.querySelector('div[class*="flex flex-col items-center"]')).not.toBeNull();
  });

  it('renders checkbox with correct checked state', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        onSelect={vi.fn()}
        isSelected={false}
        isCompact={false}
        onCheckboxChange={vi.fn()}
        isChecked={true}
      />
    );
    
    // Find the hidden checkbox input (peer class makes it sr-only)
    const checkbox = screen.getByRole('checkbox', { hidden: true });
    expect(checkbox).toBeChecked();
  });

  it('calls onCheckboxChange when checkbox is clicked', () => {
    const mockCheckboxChange = vi.fn();
    
    render(
      <PokemonCard
        pokemon={mockPokemon}
        onSelect={vi.fn()}
        isSelected={false}
        isCompact={false}
        onCheckboxChange={mockCheckboxChange}
        isChecked={false}
      />
    );
    
    // Find the label that wraps the checkbox since the real input is hidden (sr-only)
    const checkboxLabel = screen.getByRole('checkbox', { hidden: true }).closest('label');
    // Add a null check before firing the event
    if (checkboxLabel) {
      fireEvent.click(checkboxLabel);
      expect(mockCheckboxChange).toHaveBeenCalledWith(25, true);
    } else {
      throw new Error("Could not find checkbox label element");
    }
  });

  it('stops propagation when clicking on checkbox label', () => {
    const mockSelect = vi.fn();
    const mockCheckboxChange = vi.fn();
    
    render(
      <PokemonCard
        pokemon={mockPokemon}
        onSelect={mockSelect}
        isSelected={false}
        isCompact={false}
        onCheckboxChange={mockCheckboxChange}
        isChecked={false}
      />
    );
    
    // Find the label that wraps the checkbox
    const checkboxLabel = screen.getByRole('checkbox', { hidden: true }).closest('label');
    // Add a null check before firing the event
    if (checkboxLabel) {
      fireEvent.click(checkboxLabel);
      // onSelect should not be called when clicking the label
      expect(mockSelect).not.toHaveBeenCalled();
      // But onCheckboxChange should be called
      expect(mockCheckboxChange).toHaveBeenCalled();
    } else {
      throw new Error("Could not find checkbox label element");
    }
  });

  it('uses different sizes for images based on isCompact', () => {
    const { rerender, container } = render(
      <PokemonCard
        pokemon={mockPokemon}
        onSelect={vi.fn()}
        isSelected={false}
        isCompact={false}
        onCheckboxChange={vi.fn()}
        isChecked={false}
      />
    );
    
    // In standard mode, we should have a larger image container
    expect(container.querySelector('div[class*="h-32 w-32"]')).not.toBeNull();
    
    rerender(
      <PokemonCard
        pokemon={mockPokemon}
        onSelect={vi.fn()}
        isSelected={false}
        isCompact={true}
        onCheckboxChange={vi.fn()}
        isChecked={false}
      />
    );
    
    // In compact mode, we should have a smaller image container
    expect(container.querySelector('div[class*="h-16 w-16"]')).not.toBeNull();
  });

  it('handles checkbox click event correctly', () => {
    const mockCheckboxChange = vi.fn();
    const mockSelect = vi.fn();
    
    render(
      <PokemonCard
        pokemon={mockPokemon}
        onSelect={mockSelect}
        isSelected={false}
        isCompact={false}
        onCheckboxChange={mockCheckboxChange}
        isChecked={false}
      />
    );
    
    // Find the custom checkbox div (the visible part)
    const checkbox = screen.getByRole('checkbox', { hidden: true });
    const checkboxDiv = checkbox.nextElementSibling;
      
    if (checkboxDiv) {
      fireEvent.click(checkboxDiv);
      // The checkbox change handler should be called, but not the card select handler
      expect(mockCheckboxChange).toHaveBeenCalledWith(25, true);
      expect(mockSelect).not.toHaveBeenCalled();
    } else {
      throw new Error('Checkbox div element not found');
    }
  });
});
