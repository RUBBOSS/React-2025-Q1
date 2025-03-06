import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import SearchBar from '../components/SearchBar';
import PokemonList from '../components/PokemonList';
import PokemonDetails from '../components/PokemonDetails';
import LoadingSpinner from '../components/LoadingSpinner';
import ThemeToggle from '../components/ThemeToggle';
import Pagination from '../components/Pagination';
import SelectionFlyout from '../components/SelectionFlyout';
import ErrorButton from '../components/ErrorButton';
import { Pokemon } from '../types/pokemon';

import {
  setCurrentPage,
  setSearchTerm,
  selectCurrentPage,
  selectSearchTerm,
} from '../redux/slices/paginationSlice';

const Home = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const currentPage = useAppSelector(selectCurrentPage);
  const searchTerm = useAppSelector(selectSearchTerm);

  const [selectedPokemon, setSelectedPokemon] = useState<number | null>(null);
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const itemsPerPage = 9;

  useEffect(() => {
    if (!router.isReady) return;

    const pageFromUrl = router.query.page ? Number(router.query.page) : 1;
    const detailsFromUrl = router.query.details
      ? Number(router.query.details)
      : null;

    if (pageFromUrl !== currentPage) {
      dispatch(setCurrentPage(pageFromUrl));
    }
    if (detailsFromUrl !== selectedPokemon) {
      setSelectedPokemon(detailsFromUrl);
    }

    fetchPokemonData(pageFromUrl);
  }, [router.isReady, router.query, dispatch, currentPage, selectedPokemon]);

  const fetchPokemonData = async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * itemsPerPage;
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${offset}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Pokemon data');
      }

      const data = await response.json();
      setTotalCount(data.count);

      const pokemonDetailsPromises = data.results.map(
        async (pokemon: { name: string; url: string }) => {
          const detailsResponse = await fetch(pokemon.url);
          const details = await detailsResponse.json();

          const officialArtwork =
            details.sprites?.other?.['official-artwork']?.front_default ||
            undefined;

          return {
            id: details.id,
            name: details.name,
            types: details.types,
            height: details.height,
            weight: details.weight,
            image: details.sprites.front_default,
            officialArtwork: officialArtwork,
          };
        }
      );

      const detailedPokemonData = await Promise.all(pokemonDetailsPromises);
      setPokemonData(detailedPokemonData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      console.error('Error fetching Pokemon:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllPokemon = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const page = 1;
      dispatch(setCurrentPage(page));
      dispatch(setSearchTerm(''));

      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, page, search: undefined },
        },
        undefined,
        { shallow: true }
      );

      await fetchPokemonData(page);

      return pokemonData;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      console.error('Error fetching all Pokemon:', err);
      return [];
    }
  };

  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);

    try {
      if (!searchTerm) {
        await fetchAllPokemon();
        return;
      }

      dispatch(setSearchTerm(searchTerm));

      await searchPokemon(searchTerm);
    } catch (error) {
      console.error('Error searching Pokémon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchPokemon = async (term: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${term.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error('Pokemon not found');
      }

      const data = await response.json();

      const officialArtwork =
        data.sprites?.other?.['official-artwork']?.front_default || undefined;

      setPokemonData([
        {
          id: data.id,
          name: data.name,
          types: data.types,
          height: data.height,
          weight: data.weight,
          image: data.sprites.front_default,
          officialArtwork: officialArtwork,
        },
      ]);
      setTotalCount(1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      setPokemonData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPokemon = (id: number) => {
    setSelectedPokemon(id);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, details: id },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleCloseDetails = () => {
    setSelectedPokemon(null);
    const { details: _, ...restQuery } = router.query;
    console.log(_);
    router.push(
      {
        pathname: router.pathname,
        query: restQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));

    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page },
      },
      undefined,
      { shallow: true }
    );

    fetchPokemonData(page);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && selectedPokemon) {
      handleCloseDetails();
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-900">
      <Head>
        <title>Pokémon Explorer</title>
        <meta
          name="description"
          content="Explore the world of Pokémon with our interactive Pokédex"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="mt-4 flex items-center gap-4">
            <ThemeToggle />
          </div>
          <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            Pokémon Explorer
          </h1>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-xl">
            <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
          </div>
        </div>

        <div className="flex min-h-[70vh] gap-4">
          <div
            className={`${
              selectedPokemon ? 'w-1/2' : 'w-full'
            } transition-all duration-300`}
            onClick={handleBackgroundClick}
          >
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900 dark:text-red-200">
                <p>{error}</p>
              </div>
            ) : (
              <div
                className="flex flex-col gap-8"
                onClick={e => e.stopPropagation()}
              >
                <PokemonList
                  pokemonData={pokemonData}
                  onSelectPokemon={handleSelectPokemon}
                />
                {totalPages > 0 && !searchTerm && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
                <div className="flex justify-center">
                  <ErrorButton />
                </div>
              </div>
            )}
          </div>

          {selectedPokemon && (
            <div className="w-1/2 transition-all duration-300">
              <div className="h-full overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
                <PokemonDetails
                  pokemonId={selectedPokemon}
                  onClose={handleCloseDetails}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <SelectionFlyout />
    </div>
  );
};

export default Home;
