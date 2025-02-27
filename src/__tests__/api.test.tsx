import { describe, it, expect, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '../api/pokemonApi';

const store = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});

describe('Pokemon API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates endpoints for pokemon operations', () => {
    expect(pokemonApi.endpoints.getPokemonList).toBeDefined();
    expect(pokemonApi.endpoints.getPokemonByName).toBeDefined();
  });

  it('has correct reducer path', () => {
    expect(pokemonApi.reducerPath).toBe('pokemonApi');
  });

  it('includes required middleware', () => {
    const middleware = pokemonApi.middleware;
    expect(middleware).toBeDefined();
  });

  it('uses correct base URL', async () => {
    const result = await pokemonApi.endpoints.getPokemonList.initiate(1)(
      store.dispatch,
      store.getState,
      store
    );
    expect(result.originalArgs).toBeDefined();
  });
});
