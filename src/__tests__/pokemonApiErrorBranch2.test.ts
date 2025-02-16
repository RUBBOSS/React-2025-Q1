import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '../api/pokemonApi';

describe('pokemonApi error branches (via store.dispatch)', () => {
  const store = configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns error on network error', async () => {
    const networkError = new Error('Network error');
    // Simulate a rejected fetch—our API will use the catch block.
    global.fetch = vi.fn().mockRejectedValueOnce(networkError);

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate(1)
    );
    expect(result.error).toEqual({
      status: 'FETCH_ERROR',
      data: 'Invalid JSON',
    });
  });

  it('returns error when no data is received', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify(null), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate(1)
    );
    expect(result.error).toEqual({
      status: 'FETCH_ERROR',
      data: 'No data received',
    });
  });

  it('returns error on exception thrown in json()', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
      clone: () => ({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      }),
    });

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate(1)
    );
    expect(result.error).toEqual({
      status: 'FETCH_ERROR',
      data: 'Invalid JSON',
    });
  });
});
