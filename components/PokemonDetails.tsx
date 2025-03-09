'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';

interface PokemonDetailsProps {
  pokemonId: number | string;
  onClose: () => void;
}

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string;
    back_default: string;
    front_shiny: string;
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

const PokemonDetails = ({ pokemonId, onClose }: PokemonDetailsProps) => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch main Pokemon data through our API route
        const response = await fetch(`/api/pokemon/${pokemonId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch Pokemon details');
        }

        const data: PokemonDetail = await response.json();
        setPokemon(data);

        // Fetch species data for description
        const speciesResponse = await fetch(
          `/api/pokemon/species/${pokemonId}`
        );

        if (speciesResponse.ok) {
          const speciesData = await speciesResponse.json();
          // Find an English flavor text entry
          const englishEntry = speciesData.flavor_text_entries.find(
            (entry: { language: { name: string } }) =>
              entry.language.name === 'en'
          );
          if (englishEntry) {
            setDescription(englishEntry.flavor_text.replace(/\f/g, ' '));
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (pokemonId) {
      fetchPokemonDetails();
    }
  }, [pokemonId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-bold">Pokemon Details</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-200"
            aria-label="Close details"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="rounded-md bg-red-50 p-4 text-red-600">
          <p>{error}</p>
          <button
            onClick={onClose}
            className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return null;
  }

  return (
    <div className="h-full overflow-y-auto md:h-screen">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white p-4 shadow-sm dark:bg-gray-800">
        <h2 className="text-xl font-bold capitalize text-gray-900 dark:text-white">
          {pokemon.name}
        </h2>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          aria-label="Close details"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="overflow-y-visible p-4 pb-20 md:p-4 md:pb-4">
        <div className="mb-4 flex justify-center">
          <div className="relative h-48 w-48">
            <Image
              src={
                pokemon.sprites.other['official-artwork'].front_default ||
                pokemon.sprites.front_default
              }
              alt={pokemon.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'contain' }}
              priority
              className="animate-fadeIn"
            />
          </div>
        </div>

        <div className="mb-6 flex justify-center gap-2">
          {pokemon.types.map(type => (
            <span
              key={type.type.name}
              className="rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{
                backgroundColor: typeColors[type.type.name] || '#6b7280',
              }}
            >
              {type.type.name}
            </span>
          ))}
        </div>

        {description && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Description
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{description}</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Details
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-md bg-gray-100 p-2 dark:bg-gray-700">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Height:
              </span>{' '}
              <span className="text-gray-900 dark:text-gray-100">
                {pokemon.height / 10}m
              </span>
            </div>
            <div className="rounded-md bg-gray-100 p-2 dark:bg-gray-700">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Weight:
              </span>{' '}
              <span className="text-gray-900 dark:text-gray-100">
                {pokemon.weight / 10}kg
              </span>
            </div>
            <div className="col-span-2 rounded-md bg-gray-100 p-2 dark:bg-gray-700">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Pokemon ID:
              </span>{' '}
              <span className="text-gray-900 dark:text-gray-100">
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-lg font-semibold">Base Stats</h3>
          <div className="space-y-2">
            {pokemon.stats.map(stat => (
              <div key={stat.stat.name} className="w-full">
                <div className="flex justify-between">
                  <span className="text-sm font-medium capitalize">
                    {formatStatName(stat.stat.name)}
                  </span>
                  <span className="text-sm font-semibold">
                    {stat.base_stat}
                  </span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-600">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{
                      width: `${Math.min(100, (stat.base_stat / 255) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-lg font-semibold">Abilities</h3>
          <ul className="list-inside list-disc">
            {pokemon.abilities.map((ability: { ability: { name: string }, is_hidden?: boolean }) => (
              <li key={ability.ability.name} className="capitalize">
                {ability.ability.name.replace('-', ' ')}
                {ability.is_hidden && (
                  <span className="ml-2 text-sm text-gray-500">(Hidden)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Add extra padding at bottom for mobile to ensure content isn't cut off */}
      <div className="h-16 md:h-0"></div>
    </div>
  );
};

const formatStatName = (name: string) => {
  switch (name) {
    case 'hp':
      return 'HP';
    case 'attack':
      return 'Attack';
    case 'defense':
      return 'Defense';
    case 'special-attack':
      return 'Sp. Atk';
    case 'special-defense':
      return 'Sp. Def';
    case 'speed':
      return 'Speed';
    default:
      return name;
  }
};

const typeColors: { [key: string]: string } = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export default PokemonDetails;
