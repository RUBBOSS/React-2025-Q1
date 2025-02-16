import { describe, it, expect } from 'vitest';
import Card from '../components/Card';
import { renderWithProviders } from '../testUtils';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

describe('Card', () => {
  const mockState = {
    pokemon: {
      items: [],
      selectedItems: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      searchTerm: '',
    },
    selectedItems: {
      items: {},
    },
  };

  beforeEach(() => {
    mockState.pokemon.selectedItems = [];
  });

  it('renders pokemon name and image', () => {
    renderWithProviders(
      <Card
        name="bulbasaur"
        url="https://pokeapi.co/api/v2/pokemon/1/"
        description="A strange seed was planted on its back at birth."
      />,
      { preloadedState: mockState }
    );
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    const image = screen.getByAltText('bulbasaur');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
    );
  });

  it('shows fallback when image fails to load', () => {
    renderWithProviders(
      <Card
        name="test"
        url="https://pokeapi.co/api/v2/pokemon/999999/"
        description="Test description"
      />,
      { preloadedState: mockState }
    );

    const image = screen.getByAltText('test');
    fireEvent.error(image);

    expect(screen.getByText('No image')).toBeInTheDocument();
  });

  it('extracts pokemon ID correctly from URL', () => {
    renderWithProviders(
      <Card name="test-pokemon" url="https://pokeapi.co/api/v2/pokemon/25/" />,
      { preloadedState: mockState }
    );

    const image = screen.getByAltText('test-pokemon');
    expect(image).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
    );
  });

  it('displays description when provided', () => {
    const description = 'Test description';
    renderWithProviders(
      <Card
        name="test"
        url="https://pokeapi.co/api/v2/pokemon/1/"
        description={description}
      />,
      { preloadedState: mockState }
    );
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('capitalizes pokemon name', () => {
    renderWithProviders(
      <Card name="pikachu" url="https://pokeapi.co/api/v2/pokemon/25/" />,
      { preloadedState: mockState }
    );

    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('capitalize');
  });
});
