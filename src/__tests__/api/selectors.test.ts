import { describe, it, expect, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '../../api/pokemonApi';

describe('pokemonApi selectors', () => {
  it('should return empty query result when no query has been initiated', () => {
    const store = configureStore({
      reducer: { [pokemonApi.reducerPath]: pokemonApi.reducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokemonApi.middleware),
    });
    const state = store.getState();
    const queryResult =
      pokemonApi.endpoints.getPokemonList.select(1)(state) || {};
    expect(queryResult.status).toEqual('uninitialized');
    expect(queryResult.data).toBeUndefined();
    expect(queryResult.error).toBeUndefined();
  });

  it('should update selector state to pending after dispatching an endpoint', async () => {
    const store = configureStore({
      reducer: { [pokemonApi.reducerPath]: pokemonApi.reducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokemonApi.middleware),
    });
    global.fetch = vi.fn(
      (): Promise<Response> => new Promise<Response>(() => {})
    );
    store.dispatch(pokemonApi.endpoints.getPokemonList.initiate(1));
    await new Promise((resolve) => setTimeout(resolve, 50));
    const state = store.getState();
    const queryResult =
      pokemonApi.endpoints.getPokemonList.select(1)(state) || {};
    expect(queryResult.status).toEqual('pending');
  });
});
