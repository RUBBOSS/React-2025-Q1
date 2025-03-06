import { get } from './axiosConfig';
const POKE_API_URL = 'https://pokeapi.co/api/v2';
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{
    type: {
      name: string;
    };
  }>;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  species: {
    url: string;
  };
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
export const getPokemonList = async (
  limit = 20,
  offset = 0
): Promise<PokemonListResponse> => {
  try {
    return await get<PokemonListResponse>(`${POKE_API_URL}/pokemon`, {
      params: { limit, offset },
    });
  } catch (error) {
    console.error('Failed to fetch Pokemon list:', error);
    throw error;
  }
};
export const getPokemonDetails = async (
  nameOrId: string | number
): Promise<Pokemon> => {
  try {
    return await get<Pokemon>(`${POKE_API_URL}/pokemon/${nameOrId}`);
  } catch (error) {
    console.error(`Failed to fetch details for Pokemon ${nameOrId}:`, error);
    throw error;
  }
};
interface DamageRelations {
  double_damage_from: Array<{ name: string; url: string }>;
  double_damage_to: Array<{ name: string; url: string }>;
  half_damage_from: Array<{ name: string; url: string }>;
  half_damage_to: Array<{ name: string; url: string }>;
  no_damage_from: Array<{ name: string; url: string }>;
  no_damage_to: Array<{ name: string; url: string }>;
}
interface PokemonTypeResponse {
  damage_relations: DamageRelations;
  pokemon: Array<{
    pokemon: {
      name: string;
      url: string;
    };
    slot: number;
  }>;
}
export const getPokemonByType = async (type: string): Promise<PokemonTypeResponse> => {
  try {
    return await get<PokemonTypeResponse>(`${POKE_API_URL}/type/${type}`);
  } catch (error) {
    console.error(`Failed to fetch Pokemon of type ${type}:`, error);
    throw error;
  }
};
