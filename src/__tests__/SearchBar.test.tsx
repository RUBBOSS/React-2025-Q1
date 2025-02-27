import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Search from '../components/Search';
import { BrowserRouter } from 'react-router-dom';
import { SearchProvider } from '../context/SearchContext';

describe('SearchBar', () => {
  it('renders search input', () => {
    render(
      <BrowserRouter>
        <SearchProvider>
          <Search />
        </SearchProvider>
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText(/search pokémon/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });
});
