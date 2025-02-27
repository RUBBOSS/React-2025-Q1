import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '../../src/api/pokemonApi';

describe('pokemonApi', () => {
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

  it('fetches pokemon list', async () => {
    const mockData = {
      count: 1,
      results: [
        {
          name: 'bulbasaur',
          url: 'https://pokeapi.co/api/v2/pokemon/1/',
          description: 'A strange seed was planted on its back at birth.',
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-type': 'application/json' },
      })
    );

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate(1)
    );

    await vi.waitFor(() => {
      expect(result.data).toEqual(mockData);
    });
  });

  it('fetches pokemon by name', async () => {
    const mockData = {
      name: 'bulbasaur',
      types: [{ type: { name: 'grass' } }],
    };

    global.fetch = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-type': 'application/json' },
      })
    );

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonByName.initiate('bulbasaur')
    );

    await vi.waitFor(() => {
      expect(result.data).toEqual(mockData);
    });
  });
});
