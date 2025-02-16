import { API_BASE_URL } from '../config';

export async function fetchPokemonList(page: number) {
  const response = await fetch(
    `${API_BASE_URL}/pokemon?limit=9&offset=${(page - 1) * 9}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }
  return response.json();
}

export async function fetchPokemonDetails(name: string) {
  const response = await fetch(`${API_BASE_URL}/pokemon/${name}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon details');
  }
  return response.json();
}
