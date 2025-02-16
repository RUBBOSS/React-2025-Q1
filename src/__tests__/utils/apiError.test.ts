import { describe, it, expect, vi } from 'vitest';
import { fetchPokemonDetails } from '../../utils/api';

describe('API Utils Error Handling', () => {
  it('rejects with error when fetching pokemon details fails', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
    });

    await expect(fetchPokemonDetails('pikachu')).rejects.toThrow(
      'Failed to fetch Pokemon details'
    );
  });
});
