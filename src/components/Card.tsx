import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface CardProps {
  name: string;
  url: string;
}

const Card: React.FC<CardProps> = ({ name, url }) => {
  const [imageError, setImageError] = useState(false);
  const [pokeId, setPokeId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const segments = url.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    // If last segment is a number, use it directly
    if (!isNaN(Number(lastSegment))) {
      setPokeId(lastSegment);
    } else {
      // Otherwise, fetch details to get the numeric id
      fetch(url)
        .then((res) => res.json())
        .then((data) => setPokeId(String(data.id)))
        .catch((err) => console.error('Failed to fetch pokemon id:', err));
    }
  }, [url]);

  const imageUrl = pokeId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`
    : '';

  const handleClick = () => {
    navigate(`/?details=${pokeId}`);
  };

  return (
    <article
      onClick={handleClick}
      className="bg-white text-gray-900 rounded-xl shadow-lg p-6
                 transition duration-500 transform hover:scale-105
                 flex flex-col items-center cursor-pointer"
    >
      <h3 className="text-xl font-bold capitalize mb-4">{name}</h3>
      {pokeId && !imageError ? (
        <img
          src={imageUrl}
          alt={name}
          onError={() => setImageError(true)}
          className="w-32 h-32 object-contain hover:scale-110 transition-transform duration-300"
        />
      ) : (
        <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500">
          No image
        </div>
      )}
    </article>
  );
};

export default Card;
