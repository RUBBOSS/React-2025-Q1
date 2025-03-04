import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define Pokemon interfaces
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience?: number;
  sprites: {
    front_default?: string;
    back_default?: string;
    front_shiny?: string;
    other?: {
      'official-artwork'?: {
        front_default?: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  species: {
    name: string;
    url: string;
  };
  moves?: Array<{
    move: {
      name: string;
      url: string;
    };
  }>;
  // Extended props
  description?: string;
  officialArtwork?: string;
  image?: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }>;
  genera: Array<{
    genus: string;
    language: {
      name: string;
    };
  }>;
  evolution_chain: {
    url: string;
  };
  habitat?: {
    name: string;
  };
  is_legendary: boolean;
  is_mythical: boolean;
}

// Create the API service using RTK Query
export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://pokeapi.co/api/v2/' 
  }),
  endpoints: (builder) => ({
    getPokemonList: builder.query<PokemonListResponse, { limit?: number; offset?: number }>({
      query: ({ limit = 20, offset = 0 }) => `pokemon?limit=${limit}&offset=${offset}`,
    }),
    
    getPokemonByName: builder.query<Pokemon, string | number>({
      query: (nameOrId) => `pokemon/${nameOrId}`,
      transformResponse: (response: Pokemon) => {
        // Add custom fields
        return {
          ...response,
          image: response.sprites?.front_default,
          officialArtwork: response.sprites?.other?.['official-artwork']?.front_default,
        };
      },
    }),
    
    getPokemonSpecies: builder.query<PokemonSpecies, number | string>({
      query: (idOrName) => `pokemon-species/${idOrName}`,
    }),
  }),
});

export const {
  useGetPokemonListQuery,
  useGetPokemonByNameQuery,
  useGetPokemonSpeciesQuery,
} = pokemonApi;
