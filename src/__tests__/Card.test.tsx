import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Card from '../components/Card';

describe('Card', () => {
  it('renders pokemon name and image', () => {
    render(
      <BrowserRouter>
        <Card name="bulbasaur" url="https://pokeapi.co/api/v2/pokemon/1/" />
      </BrowserRouter>
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
    render(
      <BrowserRouter>
        <Card name="test" url="https://pokeapi.co/api/v2/pokemon/999999/" />
      </BrowserRouter>
    );

    const image = screen.getByAltText('test');
    fireEvent.error(image);

    expect(screen.getByText('No image')).toBeInTheDocument();
  });

  it('extracts pokemon ID correctly from URL', () => {
    render(
      <BrowserRouter>
        <Card name="test-pokemon" url="https://pokeapi.co/api/v2/pokemon/25/" />
      </BrowserRouter>
    );

    const image = screen.getByAltText('test-pokemon');
    expect(image).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
    );
  });

  it('capitalizes pokemon name', () => {
    render(
      <BrowserRouter>
        <Card name="pikachu" url="https://pokeapi.co/api/v2/pokemon/25/" />
      </BrowserRouter>
    );

    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('capitalize');
  });
});
