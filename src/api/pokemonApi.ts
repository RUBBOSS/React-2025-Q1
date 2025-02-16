import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from '@reduxjs/toolkit/query/react';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonListResponse {
  results: Pokemon[];
}

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getPokemonList: builder.query<PokemonListResponse, number | undefined>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const result = await fetchWithBQ('/pokemon');
          if (result.error) {
            const rawMsg: string = (result.error.data as string) || '';
            const errorMessage = rawMsg.trim() || 'Invalid JSON';
            return {
              error: {
                status: 'FETCH_ERROR',
                data: errorMessage,
              } as unknown as FetchBaseQueryError,
              data: undefined,
            } as QueryReturnValue<
              PokemonListResponse,
              FetchBaseQueryError,
              FetchBaseQueryMeta
            >;
          }
          if (!result.data) {
            return {
              error: {
                status: 'FETCH_ERROR',
                data: 'No data received',
              } as unknown as FetchBaseQueryError,
              data: undefined,
            } as QueryReturnValue<
              PokemonListResponse,
              FetchBaseQueryError,
              FetchBaseQueryMeta
            >;
          }
          return {
            data: result.data as PokemonListResponse,
          } as QueryReturnValue<
            PokemonListResponse,
            FetchBaseQueryError,
            FetchBaseQueryMeta
          >;
        } catch {
          return {
            error: {
              status: 'FETCH_ERROR',
              data: 'Invalid JSON',
            } as unknown as FetchBaseQueryError,
            data: undefined,
          } as QueryReturnValue<
            PokemonListResponse,
            FetchBaseQueryError,
            FetchBaseQueryMeta
          >;
        }
      },
    }),
    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => `pokemon/${name.toLowerCase()}`,
    }),
  }),
});

export const { useGetPokemonListQuery, useGetPokemonByNameQuery } = pokemonApi;
