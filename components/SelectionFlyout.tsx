import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { 
  selectSelectedPokemonIds,
  selectSelectedPokemonItems,
  clearAllSelections 
} from '../redux/slices/selectedPokemonSlice';

const SelectionFlyout: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedIds = useAppSelector(selectSelectedPokemonIds);
  const selectedItems = useAppSelector(selectSelectedPokemonItems);
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  
  if (selectedIds.length === 0) {
    return null;
  }
  
  const handleDownload = () => {
    setIsDownloading(true);
    
    try {
      const headers = ["ID", "Name", "Types", "Height", "Weight", "Image URL", "Details URL"];
      let csvContent = headers.join(",") + "\n";
      
      selectedIds.forEach(id => {
        const pokemon = selectedItems[id];
        if (pokemon) {
          const row = [
            pokemon.id,
            `"${pokemon.name}"`,
            `"${pokemon.types?.map(t => t.type.name).join(', ') || ''}"`,
            pokemon.height,
            pokemon.weight,
            `"${pokemon.officialArtwork || pokemon.image || ''}"`,
            `"https://pokeapi.co/api/v2/pokemon/${pokemon.id}/"`
          ];
          csvContent += row.join(",") + "\n";
        }
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = url;
        downloadLinkRef.current.download = `${selectedIds.length}_pokemon.csv`;
        downloadLinkRef.current.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error downloading CSV file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* Hidden download link */}
      <a ref={downloadLinkRef} style={{ display: 'none' }} />
      
      {/* Left side buttons */}
      <div className="fixed bottom-0 left-0 z-50 p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src="/shopping-cart.png"
              alt="Selected Pokémon"
              width={50}
              height={50}
              className="text-white"
            />
            <span className="absolute left-6 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {selectedIds.length}
            </span>
          </div>

          <button onClick={() => dispatch(clearAllSelections())}>
            <Image
              src="/remove-from-cart.png"
              alt="Remove all items"
              width={50}
              height={50}
              className="text-white"
            />
          </button>
        </div>
      </div>

      {/* Right side download button */}
      <div className="fixed bottom-0 right-0 z-50 p-4 shadow-lg">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={isDownloading ? 'cursor-not-allowed opacity-70' : ''}
        >
          <Image
            src="/download.png"
            alt="Download CSV"
            width={50}
            height={50}
            className="text-white"
          />
          {isDownloading && (
            <svg className="ml-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </button>
      </div>
    </>
  );
};

export default SelectionFlyout;
