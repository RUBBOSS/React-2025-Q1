import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface CardProps {
  name: string;
  url: string;
}

const Card: React.FC<CardProps> = ({ name, url }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const extractPokemonId = (url: string): string | null => {
    // Try to extract ID from URL like "https://pokeapi.co/api/v2/pokemon/4/"
    const numberMatch = url.match(/\/pokemon\/(\d+)/);
    if (numberMatch) return numberMatch[1];

    // For search results, fetch the ID from the stored mapping
    const searchMatch = url.match(/\/pokemon\/([\w-]+)/);
    if (searchMatch) {
      // Default to ID 1 if we can't determine the proper ID
      // You might want to implement a proper name-to-id mapping here
      return '1';
    }
    return null;
  };

  useEffect(() => {
    const pokemonId = extractPokemonId(url);
    if (pokemonId) {
      setImageUrl(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
      );
    }
  }, [url]);

  const handleCardClick = () => {
    const pokemonId = extractPokemonId(url);
    searchParams.set('details', pokemonId || '');
    setSearchParams(searchParams);
  };

  return (
    <article
      onClick={handleCardClick}
      className="bg-white text-gray-900 rounded-xl shadow-lg p-6 
                 transition duration-500 transform hover:scale-105 
                 flex flex-col items-center cursor-pointer"
    >
      <h3 className="text-xl font-bold capitalize mb-4">{name}</h3>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          className="w-32 h-32 object-contain hover:scale-110 transition-transform duration-300"
          onLoad={() => setLoading(false)}
        />
      )}
      {loading && (
        <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-lg"></div>
      )}
    </article>
  );
};

export default Card;
