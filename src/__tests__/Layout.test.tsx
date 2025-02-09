import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchProvider } from '../context/SearchContext';
import Layout from '../components/Layout';

describe('Layout', () => {
  it('renders main layout components', () => {
    render(
      <BrowserRouter>
        <SearchProvider>
          <Layout />
        </SearchProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Pokémon Search')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Pokémon')).toBeInTheDocument();
  });

  it('renders with search params', () => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useSearchParams: () => [
          new URLSearchParams({ details: 'bulbasaur' }),
          vi.fn(),
        ],
      };
    });

    render(
      <BrowserRouter>
        <SearchProvider>
          <Layout />
        </SearchProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Pokémon Search')).toBeInTheDocument();
  });
});
