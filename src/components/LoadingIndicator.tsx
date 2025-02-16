import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/mockPokemonSlice';

const LoadingIndicator: React.FC = () => {
  const isLoading = useSelector(
    (state: RootState) => state.pokemon?.loading ?? false
  );

  if (!isLoading) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      data-testid="loader"
    >
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default LoadingIndicator;
