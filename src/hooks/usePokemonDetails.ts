import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

interface PokemonDetails {
  name: string;
  sprites: { front_default: string };
  types: Array<{ type: { name: string } }>;
}

export function usePokemonDetails(name: string) {
  const [data, setData] = useState<PokemonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const response = await fetch(`${API_BASE_URL}/pokemon/${name}`);
        if (!response.ok) throw new Error('Failed to fetch pokemon details');
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetails();
  }, [name]);

  return { data, isLoading, error };
}
