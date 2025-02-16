import { describe, it, expect } from 'vitest';
import Layout from '../components/Layout';
import { renderWithProviders } from '../testUtils';
import { screen } from '@testing-library/react';

describe('Layout', () => {
  const defaultState = {
    pokemon: {
      items: [],
      selectedItems: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      searchTerm: '',
    },
  };

  it('renders main layout components', () => {
    renderWithProviders(<Layout />, {
      preloadedState: defaultState,
    });

    expect(screen.getByText('Pokémon Search')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Pokémon')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    renderWithProviders(<Layout />, {
      preloadedState: defaultState,
    });

    expect(screen.getByRole('img', { name: 'Sun' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Moon' })).toBeInTheDocument();
  });
});
