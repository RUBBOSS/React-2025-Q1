import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { routes } from '../routes';
import { ThemeProvider } from '../context/ThemeContext';
import { SearchProvider } from '../context/SearchContext';

const mockStore = configureStore({
  reducer: {
    pokemon: () => ({
      items: [],
      selectedItems: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      searchTerm: '',
    }),
    selectedItems: () => ({ items: {} }),
  },
});

const renderWithRouter = (initialEntries = ['/']) => {
  const router = createMemoryRouter(routes, {
    initialEntries,
    basename: '',
    future: {
      v7_normalizeFormMethod: true,
    },
  });

  return render(
    <Provider store={mockStore}>
      <ThemeProvider>
        <SearchProvider>
          <RouterProvider router={router} />
        </SearchProvider>
      </ThemeProvider>
    </Provider>
  );
};

describe('Router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders home page by default', async () => {
    renderWithRouter(['/']);
    await waitFor(() => {
      expect(screen.getByText(/Pokémon Search/i)).toBeInTheDocument();
    });
  });
});

describe('Routes', () => {
  it('has root route configured correctly', () => {
    const rootRoute = routes[0];
    expect(rootRoute.path).toBe('/');
  });

  it('has correct child routes', () => {
    const children = routes[0].children;
    expect(children).toHaveLength(2);
    expect(children?.find((route) => route.path === '404')).toBeDefined();
    expect(children?.find((route) => route.index === true)).toBeDefined();
  });
});
