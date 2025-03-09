'use client';

import Image from 'next/image';
import { Pokemon } from '../types/pokemon';

export interface PokemonCardProps {
  pokemon: Pokemon;
  onSelect: (id: number) => void;
  isSelected: boolean;
  isCompact: boolean;
  onCheckboxChange: (id: number, isChecked: boolean) => void;
  isChecked: boolean;
}

const PokemonCard = ({
  pokemon,
  onSelect,
  isSelected,
  isCompact,
  onCheckboxChange,
  isChecked,
}: PokemonCardProps) => {
  const handleCardClick = () => {
    onSelect(pokemon.id);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop propagation from the entire label
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(pokemon.id, e.target.checked);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative transform cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all duration-200 dark:bg-gray-800
        ${isSelected ? 'scale-[1.02] ring-2 ring-blue-500' : 'hover:scale-105'}`}
    >
      <div className="absolute right-2 top-2 z-10">
        <label 
          className="relative inline-flex cursor-pointer items-center"
          onClick={handleCheckboxClick}  // Add click handler to label
        >
          <input
            type="checkbox"
            className="peer sr-only"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <div className={`
            peer relative flex items-center justify-center
            ${isCompact ? 'h-4 w-4' : 'h-5 w-5'}
            rounded border border-gray-300 bg-white transition-all
            after:absolute after:opacity-0
            after:transition-opacity
            after:content-['✓']
            after:text-white
            peer-checked:border-blue-500
            peer-checked:bg-blue-500
            peer-checked:after:opacity-100
            peer-hover:border-blue-400
            dark:border-gray-600
            dark:bg-gray-700
            dark:peer-checked:border-blue-400
            dark:peer-checked:bg-blue-400
            ${isCompact ? 'after:text-xs' : 'after:text-sm'}
          `}></div>
        </label>
      </div>

      <div
        className={`p-4 ${
          isCompact ? 'flex items-center' : 'flex flex-col items-center'
        }`}
      >
        <div
          className={`relative ${
            isCompact ? 'mr-4 h-16 w-16 flex-shrink-0' : 'h-32 w-32'
          }`}
        >
          <Image
            src={
              pokemon.sprites.other['official-artwork'].front_default ||
              pokemon.sprites.front_default ||
              '/placeholder-pokemon.png'
            }
            alt={pokemon.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        <div className={isCompact ? 'flex-1' : 'w-full text-center'}>
          <h2 className="text-xl font-semibold capitalize text-gray-800 dark:text-white">
            {pokemon.name}
          </h2>
          <div
            className={`mt-2 flex flex-wrap ${
              isCompact ? 'gap-1' : 'justify-center gap-2'
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
