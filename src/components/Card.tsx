import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addItem, removeItem } from '../features/selectedItemsSlice';

interface CardProps {
  name: string;
  url: string;
  description?: string;
}

const Card: React.FC<CardProps> = ({ name, url, description }) => {
  const [imageError, setImageError] = useState(false);
  const [pokeId, setPokeId] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isSelected = useSelector(
    (state: RootState) => !!state.selectedItems.items[name]
  );

  useEffect(() => {
    const segments = url.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    if (!isNaN(Number(lastSegment))) {
      setPokeId(lastSegment);
    } else {
      fetch(url)
        .then((res) => res.json())
        .then((data) => setPokeId(String(data.id)))
        .catch((err) => console.error('Failed to fetch pokemon id:', err));
    }
  }, [url]);

  const imageUrl = pokeId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`
    : '';

  const handleClick = useCallback(() => {
    const currentParams = new URLSearchParams(location.search);
    currentParams.set('details', pokeId);
    navigate(`${location.pathname}?${currentParams.toString()}`);
  }, [location, pokeId, navigate]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      dispatch(addItem({ name, url, description: `Pokémon ${name}` }));
    } else {
      dispatch(removeItem(name));
    }
  };

  return (
    <article
      onClick={handleClick}
      className="pokemon-card bg-white text-gray-900 rounded-xl shadow-lg p-6
                 hover:shadow-xl transition-shadow duration-200
                 flex flex-col items-center cursor-pointer"
    >
      <h3 className="text-xl font-bold capitalize mb-4">{name}</h3>
      {pokeId && !imageError ? (
        <img
          src={imageUrl}
          alt={name}
          onError={() => setImageError(true)}
          className="w-32 h-32 object-contain"
        />
      ) : (
        <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500">
          No image
        </div>
      )}
      {description && (
        <p className="mt-2 text-gray-600 text-center">{description}</p>
      )}
      <div className="mt-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          className="form-checkbox"
        />
      </div>
    </article>
  );
};

export default Card;
