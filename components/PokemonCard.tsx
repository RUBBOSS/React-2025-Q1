import React from 'react';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { toggleSelection, selectIsSelected, addPokemonData } from '../redux/slices/selectedPokemonSlice';

interface PokemonCardProps {
  id: number;
  name: string;
  image?: string;
  officialArtwork?: string;
  types?: Array<{ type: { name: string } }>;
  height?: number;
  weight?: number;
  onSelect: (id: number) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ 
  id, 
  name, 
  image, 
  officialArtwork, 
  types = [],
  height,
  weight,
  onSelect 
}) => {
  const dispatch = useAppDispatch();
  const isSelected = useAppSelector(state => selectIsSelected(state, id));
  
  // Get best available image
  const getBestImage = (): string => {
    if (officialArtwork) return officialArtwork;
    if (image) return image;
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };
  
  const handleSelectionToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    dispatch(toggleSelection(id));
    
    if (!isSelected) {
      dispatch(addPokemonData({
        id,
        name,
        types,
        height: height ?? 0,
        weight: weight ?? 0,
        sprites: {
          other: {
            'official-artwork': { front_default: officialArtwork }
          }
        },
        abilities: [],
        stats: [],
        species: { name, url: '' }
      }));
    }
  };

  return (
    <div
      className={`relative flex cursor-pointer flex-col items-center rounded-lg bg-white p-6 shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800 dark:hover:shadow-gray-700/50 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onSelect(id)}
    >
      
      {/* Checkbox for selection */}
      <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelectionToggle}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
          />
        </label>
      </div>
      
      {/* Pokemon Image */}
      <div className="my-4 flex h-40 w-40 items-center justify-center">
        <Image
          src={getBestImage()}
          alt={name}
          className="max-h-full max-w-full object-contain transition-transform hover:scale-110"
          loading="lazy"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        if (!target.src.includes('github')) {
          target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
        }
          }}
          width={160}
          height={160}
        />
      </div>
      
      <h2 className="mt-2 text-center text-lg font-bold capitalize text-gray-800 dark:text-white">
        {name}
      </h2>
    </div>
  );
};

export default PokemonCard;
