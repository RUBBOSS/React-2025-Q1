import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { usePokemonDetails } from '../../hooks/usePokemonDetails';

describe('usePokemonDetails', () => {
  it('fetches pokemon details', async () => {
    const mockData = {
      name: 'pikachu',
      sprites: { front_default: 'url' },
      types: [{ type: { name: 'electric' } }],
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => usePokemonDetails('pikachu'));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('handles errors', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => usePokemonDetails('invalid'));

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
      expect(result.current.isLoading).toBe(false);
    });
  });
});
