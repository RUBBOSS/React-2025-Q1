'use client';

import { Pokemon } from '../types/pokemon';
import { useState } from 'react';
import PokemonCard from './PokemonCard';

interface PokemonListProps {
  pokemonData: Pokemon[];
  onSelectPokemon: (id: number) => void;
  selectedId?: number | null;
  compact?: boolean;
}

const PokemonList = ({
  pokemonData,
  onSelectPokemon,
  selectedId = null,
  compact = false,
}: PokemonListProps) => {
  const [selectedPokemon, setSelectedPokemon] = useState<number[]>([]);

  const handleCheckboxChange = (id: number, isChecked: boolean) => {
    setSelectedPokemon(prev => {
      if (isChecked) {
        return [...prev, id];
      } else {
        return prev.filter(pokemonId => pokemonId !== id);
      }
    });
  };

  const handleCompare = () => {
    console.log('Selected for comparison:', selectedPokemon);
  };

  const handleClearSelection = () => {
    setSelectedPokemon([]);
  };

  if (!pokemonData || pokemonData.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        No Pokemon found. Try a different search term.
      </div>
    );
  }

  return (
    <div>
      {selectedPokemon.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-blue-50 p-4 shadow dark:bg-blue-900/30">
          <span className="text-sm font-medium">
            {selectedPokemon.length} Pokemon selected
          </span>
          <div className="space-x-2">
            <button
              className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
              onClick={handleCompare}
            >
              Compare
            </button>
            <button
              className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
              onClick={handleClearSelection}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div
        className={`grid ${
          compact
            ? 'grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'
            : 'grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {pokemonData.map(poke => (
          <PokemonCard
            key={poke.id}
            pokemon={poke}
            onSelect={onSelectPokemon}
            isSelected={selectedId === poke.id}
            isCompact={compact}
            onCheckboxChange={handleCheckboxChange}
            isChecked={selectedPokemon.includes(poke.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PokemonList;
