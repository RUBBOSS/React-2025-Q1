import React from 'react';
import PokemonCard from './PokemonCard';
import { Pokemon } from '../types/pokemon';
interface PokemonListProps {
  pokemonData: Pokemon[];
  onSelectPokemon: (id: number) => void;
}
const PokemonList: React.FC<PokemonListProps> = ({ pokemonData, onSelectPokemon }) => {
  if (pokemonData.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        No Pokemon found. Try a different search term.
      </div>
    );
  }
  const displayedPokemon = pokemonData.slice(0, 9);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {displayedPokemon.map(pokemon => (
        <PokemonCard
          key={pokemon.id}
          id={pokemon.id}
          name={pokemon.name}
          image={pokemon.image}
          officialArtwork={pokemon.officialArtwork}
          types={pokemon.types}
          height={pokemon.height}
          weight={pokemon.weight}
          onSelect={onSelectPokemon}
        />
      ))}
    </div>
  );
};
export default PokemonList;
