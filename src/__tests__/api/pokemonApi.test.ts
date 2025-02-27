import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '../../api/pokemonApi';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

interface TestApiResult<T> {
  data?: T;
  error?: unknown;
}

describe('pokemonApi', () => {
  let store: ReturnType<typeof configureStore>;
  let appDispatch: ThunkDispatch<
    ReturnType<(typeof store)['getState']>,
    unknown,
    Action
  >;

  beforeEach(() => {
    vi.clearAllMocks();
    store = configureStore({
      reducer: { [pokemonApi.reducerPath]: pokemonApi.reducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokemonApi.middleware),
    });
    appDispatch = store.dispatch as ThunkDispatch<
      ReturnType<typeof store.getState>,
      unknown,
      Action
    >;
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

    const result = (await appDispatch(
      pokemonApi.endpoints.getPokemonList.initiate(1)
    )) as unknown as TestApiResult<typeof mockData>;
    expect(result.data).toEqual(mockData);
  });

  interface PokemonType {
    type: {
      name: string;
    };
  }

  interface PokemonByName {
    name: string;
    types: PokemonType[];
  }

  it('fetches pokemon by name', async () => {
    const mockData: PokemonByName = {
      name: 'bulbasaur',
      types: [{ type: { name: 'grass' } }],
    };

    global.fetch = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-type': 'application/json' },
      })
    );

    const result = (await appDispatch(
      pokemonApi.endpoints.getPokemonByName.initiate('bulbasaur')
    )) as unknown as TestApiResult<typeof mockData>;
    expect(result.data).toEqual(mockData);
  });

  it('handles no data received when fetching pokemon list', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce(
      new Response('null', {
        status: 200,
        headers: { 'Content-type': 'application/json' },
      })
    );

    const result = (await appDispatch(
      pokemonApi.endpoints.getPokemonList.initiate(1)
    )) as unknown as TestApiResult<{ count: number; results: unknown[] }>;
    expect(result.error).toEqual({
      status: 'FETCH_ERROR',
      data: 'No data received',
    });
  });

  it('handles network error when fetching pokemon list (catch block)', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network failure'));
    const result = (await appDispatch(
      pokemonApi.endpoints.getPokemonList.initiate(1)
    )) as unknown as TestApiResult<{ count: number; results: unknown[] }>;
    expect(result.error).toEqual({
      status: 'FETCH_ERROR',
      data: 'Invalid JSON',
    });
  });
});
