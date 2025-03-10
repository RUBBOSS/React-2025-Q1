'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams as useNextSearchParams, useRouter as useNextRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import SearchBar from './SearchBar';
import PokemonCard from './PokemonCard';
import PokemonDetails from './PokemonDetails';
import LoadingSpinner from './LoadingSpinner';
import ThemeToggle from './ThemeToggle';
import Pagination from './Pagination';
import ErrorButton from './ErrorButton';
import SelectionFlyout from './SelectionFlyout';
import { Pokemon } from '../types/pokemon';

import {
  setCurrentPage,
  setSearchTerm,
  selectCurrentPage,
  selectSearchTerm,
} from '../redux/slices/paginationSlice';

import {
  toggleSelection,
  selectSelectedPokemonIds,
} from '../redux/slices/selectedPokemonSlice';

const HomePage = () => {
  const nextRouter = useNextRouter();
  const dispatch = useAppDispatch();
  const detailsRef = useRef<HTMLDivElement>(null);
  
  // Only try to access React Router hooks when the component is mounted
  // and we're in a browser context
  const [routerHooks, setRouterHooks] = useState({
    isUsingReactRouter: false,
    initialData: [] as Pokemon[],
    initialCount: 0,
    routerLoading: false,
  });
  
  useEffect(() => {
    const detectReactRouter = async () => {
      // Safe to check for React Router after mount
      try {
        if (typeof window !== 'undefined') {
          const ReactRouter = await import('react-router-dom');
          let isUsingReactRouter = false;
          let data, count = 0, loading = false;
        
          try {
            // Try to use React Router hooks
            ReactRouter.useLocation();
            isUsingReactRouter = true;
          } catch {
            isUsingReactRouter = false;
          }
          
          setRouterHooks({
            isUsingReactRouter,
            initialData: data || [],
            initialCount: count || 0,
            routerLoading: loading,
          });
        }
      } catch (e) {
        console.error("Failed to detect React Router:", e);
      }
    };
    detectReactRouter();
  }, []);

  // Use Next.js hooks/context which are always available
  const nextSearchParams = useNextSearchParams();
  const currentPage = useAppSelector(selectCurrentPage);
  const searchTerm = useAppSelector(selectSearchTerm);
  const selectedIds = useAppSelector(selectSelectedPokemonIds);

  const [selectedPokemon, setSelectedPokemon] = useState<number | null>(null);
  const [pokemonData, setPokemonData] = useState<Pokemon[]>(routerHooks.initialData);
  const [isLoading, setIsLoading] = useState(routerHooks.initialData.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(routerHooks.initialCount);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const itemsPerPage = 9;

  // Fetch data on initial load if using Next.js
  useEffect(() => {
    if (!routerHooks.isUsingReactRouter && !searchTerm && pokemonData.length === 0) {
      fetchPokemonData(currentPage);
    }
  }, [routerHooks.isUsingReactRouter]);

  useEffect(() => {
    if (!nextSearchParams) return;

    const pageFromUrl = nextSearchParams.get('page')
      ? Number(nextSearchParams.get('page'))
      : 1;
    const detailsFromUrl = nextSearchParams.get('details')
      ? Number(nextSearchParams.get('details'))
      : null;
    const searchFromUrl = nextSearchParams.get('search') || '';

    if (pageFromUrl !== currentPage) {
      dispatch(setCurrentPage(pageFromUrl));
    }

    if (detailsFromUrl !== selectedPokemon) {
      setSelectedPokemon(detailsFromUrl);
      setDetailsVisible(!!detailsFromUrl);
    }

    if (searchFromUrl !== searchTerm) {
      dispatch(setSearchTerm(searchFromUrl));
      if (searchFromUrl) {
        fetchSearchResults(searchFromUrl);
      } else if (pageFromUrl !== currentPage) {
        setPokemonData(routerHooks.initialData);
        setTotalCount(routerHooks.initialCount);
      }
    }
  }, [nextSearchParams]);

  useEffect(() => {
    if (detailsRef.current) {
      if (selectedPokemon) {
        setDetailsVisible(true);

        setIsDetailsOpen(true);

        setTimeout(() => {
          if (detailsRef.current) {
            detailsRef.current.style.transform = 'translateX(0)';
          }
        }, 50);
      } else {
        if (detailsRef.current) {
          detailsRef.current.style.transform = 'translateX(100%)';
        }
        setIsDetailsOpen(false);
      }
    }
  }, [selectedPokemon]);

  useEffect(() => {
    if (searchTerm) {
      fetchSearchResults(searchTerm);
    }
  }, [searchTerm, currentPage]);

  useEffect(() => {
    if (!searchTerm) {
      fetchPokemonData(currentPage);
    }
  }, [currentPage]);

  const handleSelectPokemon = (id: number) => {
    setSelectedPokemon(id);
    setDetailsVisible(true);
    const params = new URLSearchParams(nextSearchParams?.toString() ?? '');
    params.set('details', id.toString());
    nextRouter.push(`/?${params.toString()}`);
  };

  const handleCloseDetails = () => {
    if (detailsRef.current) {
      detailsRef.current.style.transform = 'translateX(100%)';
    }

    setTimeout(() => {
      setSelectedPokemon(null);
      setDetailsVisible(false);
      const params = new URLSearchParams(nextSearchParams?.toString() ?? '');
      params.delete('details');
      nextRouter.push(`/?${params.toString()}`);
    }, 300);
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    const params = new URLSearchParams(nextSearchParams?.toString() ?? '');
    params.set('page', page.toString());
    nextRouter.push(`/?${params.toString()}`);
  };

  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term));
    dispatch(setCurrentPage(1));
    
    const params = new URLSearchParams(nextSearchParams?.toString() ?? '');
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    nextRouter.push(`/?${params.toString()}`);
  };

  const fetchSearchResults = async (term: string) => {
    if (!term) {
      setPokemonData(routerHooks.initialData);
      setTotalCount(routerHooks.initialCount);
      return;
    }

    setError(null);

    try {
      const response = await fetch('/api/pokemon?limit=1000');

      if (!response.ok) {
        throw new Error('Failed to fetch search data');
      }

      const data = await response.json();

      const filteredResults = data.results.filter((pokemon: { name: string }) =>
        pokemon.name.toLowerCase().includes(term.toLowerCase())
      );

      setTotalCount(filteredResults.length);

      const page = Number(nextSearchParams?.get('page') || 1);
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedResults = filteredResults.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      if (paginatedResults.length === 0) {
        setPokemonData([]);
        return;
      }

      const detailedData = await Promise.all(
        paginatedResults.map(async (pokemon: { name: string; url: string }) => {
          const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
          const detailResponse = await fetch(`/api/pokemon/${pokemonId}`);

          if (!detailResponse.ok) {
            throw new Error(`Failed to fetch details for ${pokemon.name}`);
          }

          return await detailResponse.json();
        })
      );

      setPokemonData(detailedData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      setPokemonData([]);
    }
  };

  const fetchPokemonData = async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * itemsPerPage;
      const response = await fetch(
        `/api/pokemon?limit=${itemsPerPage}&offset=${offset}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setTotalCount(data.count);

      const detailedData = await Promise.all(
        data.results.map(async (pokemon: { name: string; url: string }) => {
          const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
          const detailResponse = await fetch(`/api/pokemon/${pokemonId}`);

          if (!detailResponse.ok) {
            throw new Error(`Failed to fetch details for ${pokemon.name}`);
          }

          return await detailResponse.json();
        })
      );

      setPokemonData(detailedData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      setPokemonData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (id: number, isChecked: boolean) => {
    const pokemon = pokemonData.find(p => p.id === id);
    if (pokemon && isChecked !== selectedIds.includes(id)) {
      dispatch(toggleSelection({ id, pokemon }));
    }
  };

  const renderPokemon = (pokemon: Pokemon) => (
    <PokemonCard
      key={pokemon.id}
      pokemon={pokemon}
      onSelect={handleSelectPokemon}
      isSelected={selectedPokemon === pokemon.id}
      isCompact={detailsVisible}
      onCheckboxChange={handleCheckboxChange}
      isChecked={selectedIds.includes(pokemon.id)}
    />
  );

  // Use the loader state if available, otherwise use local state
  const actualIsLoading = routerHooks.routerLoading || isLoading;

  return (
    <div
      className={`min-h-screen bg-gray-100 py-8 transition-colors duration-300 dark:bg-gray-900 ${
        isDetailsOpen ? 'details-open' : ''
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Pokémon Explorer
          </h1>
          <ThemeToggle />
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
        </div>
        {error && (
          <div className="my-4 text-center text-red-500">Error: {error}</div>
        )}

        {actualIsLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex flex-col md:flex-row md:items-start">
            <div
              className={`transition-all duration-300 ease-in-out ${
                detailsVisible ? 'w-full pr-0 md:w-1/2 md:pr-2' : 'w-full'
              }`}
              style={{
                width: detailsVisible ? undefined : '100%',
                flexGrow: detailsVisible ? undefined : 1,
              }}
            >
              {pokemonData.length === 0 && searchTerm ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
                  <p className="text-lg text-yellow-700">
                    No Pokémon found matching "
                    <span className="font-semibold">{searchTerm}</span>"
                  </p>
                  <p className="mt-2 text-yellow-600">
                    Try a different search term or browse all Pokémon
                  </p>
                  <button
                    onClick={() => handleSearch('')}
                    className="mt-4 rounded-md bg-yellow-500 px-4 py-2 text-white transition-colors hover:bg-yellow-600"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <div
                  className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${
                    detailsVisible ? 'md:grid-cols-1 lg:grid-cols-2' : ''
                  }`}
                >
                  {pokemonData.map(pokemon => renderPokemon(pokemon))}
                </div>
              )}

              {totalCount > itemsPerPage && pokemonData.length > 0 && (
                <div className="mb-4 mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalCount / itemsPerPage)}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>

            <div
              ref={detailsRef}
              className={`fixed bottom-0 right-0 top-0 z-20 h-screen translate-x-full 
                transform bg-white shadow-lg transition-all duration-300 ease-in-out 
                dark:bg-gray-800 md:relative md:h-auto md:translate-x-0 md:opacity-0
                ${
                  detailsVisible
                    ? 'md:w-1/2 md:opacity-100'
                    : 'overflow-hidden md:w-0'
                }`}
              style={{
                visibility: detailsVisible ? 'visible' : 'hidden',
                maxWidth: detailsVisible ? '100%' : 0,
              }}
            >
              {selectedPokemon && (
                <PokemonDetails
                  pokemonId={selectedPokemon}
                  onClose={handleCloseDetails}
                />
              )}
            </div>
          </div>
        )}

        {!actualIsLoading && (
          <div className="flex w-full justify-center">
            <ErrorButton />
          </div>
        )}

        <SelectionFlyout />
      </div>
    </div>
  );
};

export default HomePage;
