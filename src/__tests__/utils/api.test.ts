import { describe, it, expect, vi } from 'vitest';
import { fetchPokemonList, fetchPokemonDetails } from '../../utils/api';

describe('API Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches pokemon list successfully', async () => {
    const mockData = {
      count: 1,
      results: [
        {
          name: 'bulbasaur',
          url: 'https://pokeapi.co/api/v2/pokemon/1/',
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchPokemonList(1);
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/pokemon?limit=9&offset=0')
    );
  });

  it('handles fetch errors', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
    });

    await expect(fetchPokemonList(1)).rejects.toThrow(
      'Failed to fetch Pokemon list'
    );
  });

  it('fetches pokemon details successfully', async () => {
    const mockData = { name: 'bulbasaur', id: 1 };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchPokemonDetails('bulbasaur');
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/pokemon/bulbasaur')
    );
  });
});
