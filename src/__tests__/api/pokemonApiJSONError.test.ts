import { describe, it, expect, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '../../api/pokemonApi';

describe('pokemonApi JSON error handling', () => {
  it('handles JSON parse error gracefully', async () => {
    const store = configureStore({
      reducer: { [pokemonApi.reducerPath]: pokemonApi.reducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokemonApi.middleware),
    });
    global.fetch = vi.fn().mockResolvedValueOnce(
      new Response('not-valid-json', {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate(1)
    );
    expect(result.error).toEqual({
      status: 'FETCH_ERROR',
      data: 'not-valid-json',
    });
  });
});
