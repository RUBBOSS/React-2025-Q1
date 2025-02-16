import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';
import { ThemeProvider } from './context/ThemeContext';
import mockPokemonReducer from './store/mockPokemonSlice';
import selectedItemsReducer from './features/selectedItemsSlice';

const createMockStore = (preloadedState = {}) => {
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
    selectedItems: {
      items: {},
    },
  };

  return configureStore({
    reducer: {
      pokemon: mockPokemonReducer,
      selectedItems: selectedItemsReducer,
    },
    preloadedState: {
      ...defaultState,
      ...preloadedState,
    },
  });
};

export const renderWithProviders = (
  ui: ReactElement,
  { preloadedState = {}, ...renderOptions } = {}
) => {
  const store = createMockStore(preloadedState);

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            <SearchProvider>{children}</SearchProvider>
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  };

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};
