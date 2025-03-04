import axios from 'axios';

// Extend AxiosRequestConfig to include the retry property
declare module 'axios' {
  interface AxiosRequestConfig {
    retry?: number;
  }
}

const API_URL = 'https://pokeapi.co/api/v2';
const IMAGE_FALLBACK = '/placeholder-pokemon.svg';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.response.use(null, async error => {
  const { config } = error;

  if (!config || !config.retry) {
    return Promise.reject(error);
  }

  config.retry -= 1;

  const backoff = new Promise(resolve => {
    setTimeout(() => {
      resolve(null);
    }, 1000);
  });

  await backoff;
  return api(config);
});

export interface Pokemon {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
}

export const getPokemonList = async (
  limit = 20,
  offset = 0
): Promise<PokemonListResponse> => {
  try {
    const response = await api.get(`/pokemon`, {
      params: { limit, offset },
      retry: 2,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
};

// Get details for a specific pokemon
export const getPokemonDetails = async (
  id: string | number
): Promise<Pokemon> => {
  try {
    const response = await api.get(`/pokemon/${id}`, { retry: 2 });
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pokemon details for ${id}:`, error);
    // Return fallback Pokemon data
    return {
      id: typeof id === 'string' ? parseInt(id) : id,
      name: typeof id === 'string' ? id : String(id),
      types: [{ type: { name: 'unknown' } }],
      sprites: {
        front_default: IMAGE_FALLBACK,
        other: {
          'official-artwork': {
            front_default: IMAGE_FALLBACK,
          },
        },
      },
    };
  }
};

// Search for Pokemon by name
export const searchPokemon = async (
  query: string,
  limit = 20
): Promise<Pokemon[]> => {
  if (!query.trim()) {
    // If empty query, return first page of results
    const list = await getPokemonList(limit);
    return Promise.all(list.results.map(p => getPokemonDetails(p.name)));
  }

  try {
    // For search, we'll fetch a larger set and filter client-side
    // In a real app, you'd want a backend endpoint for search
    const list = await getPokemonList(150);
    const filtered = list.results
      .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit);

    if (filtered.length === 0) return [];

    return Promise.all(filtered.map(p => getPokemonDetails(p.name)));
  } catch (error) {
    console.error('Error searching Pokemon:', error);
    return [];
  }
};

// Extract the pokemon ID from its URL
export const getPokemonIdFromUrl = (url: string): string => {
  const matches = url.match(/\/pokemon\/(\d+)\//);
  return matches?.[1] || '1';
};

// Get the best available image for a pokemon
export const getBestPokemonImage = (pokemon: Pokemon): string => {
  if (!pokemon || !pokemon.sprites) return IMAGE_FALLBACK;

  return (
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default ||
    IMAGE_FALLBACK
  );
};
