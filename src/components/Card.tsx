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

  useEffect(() => {
    const pokemonId = url.split('/').filter(Boolean).pop();
    if (pokemonId) {
      setImageUrl(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
      );
    }
  }, [url]);

  const handleCardClick = () => {
    const pokemonId = url.split('/').filter(Boolean).pop();
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
