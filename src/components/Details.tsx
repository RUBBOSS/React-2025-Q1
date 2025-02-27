import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Loader from './Loader';
import {
  PokemonDetails,
  ChainLink,
  SimplifiedEvolutionNode,
} from '../types/pokemon';
import useOnClickOutside from '../hooks/useOnClickOutside';
import { fetchSpeciesDetails, fetchEvolutionChain } from '../api/pokeapi';

const fetchPokemonDetails = async (url: string): Promise<PokemonDetails> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch pokemon details from ${url}`);
  }
  return response.json();
};

const Details: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<
    SimplifiedEvolutionNode[]
  >([]);
  const [loadingEvolution, setLoadingEvolution] = useState(false);
  const [evolutionSprites, setEvolutionSprites] = useState<
    Record<string, string>
  >({});
  const pokemonId = searchParams.get('details');
  const detailsRef = useRef<HTMLDivElement>(null);

  const extractEvolutionChain = useCallback(
    (chain: ChainLink, level = 1): SimplifiedEvolutionNode[] => {
      const current: SimplifiedEvolutionNode = {
        name: chain.species.name,
        level,
        min_level: chain.evolution_details?.[0]?.min_level,
        trigger: chain.evolution_details?.[0]?.trigger?.name,
      };

      const evolutions = chain.evolves_to
        .map((next) => extractEvolutionChain(next, level + 1))
        .flat();

      return [current, ...evolutions];
    },
    []
  );

  const fetchEvolutionData = useCallback(async () => {
    if (!details?.species?.url) return;

    setLoadingEvolution(true);
    try {
      const speciesData = await fetchSpeciesDetails(details.species.url);
      const evolutionData = await fetchEvolutionChain(
        speciesData.evolution_chain.url
      );
      const chain = extractEvolutionChain(evolutionData.chain);

      const sprites: Record<string, string> = {};
      for (const evo of chain) {
        try {
          const pokemonData = await fetchPokemonDetails(
            `https://pokeapi.co/api/v2/pokemon/${evo.name}/`
          );
          sprites[evo.name] = pokemonData.sprites.front_default;
        } catch (err) {
          console.error(`Failed to fetch sprite for ${evo.name}:`, err);
        }
      }

      setEvolutionSprites(sprites);
      setEvolutionChain(chain);
    } catch (err) {
      console.error('Failed to fetch evolution data:', err);
    } finally {
      setLoadingEvolution(false);
    }
  }, [details, extractEvolutionChain]);

  const handleClose = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if ((event.target as Element)?.closest('.pokemon-card')) {
        return;
      }

      const params = new URLSearchParams(searchParams);
      params.delete('details');
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  useOnClickOutside(detailsRef, handleClose);

  const handleCloseButton = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    handleClose(e.nativeEvent);
  };

  useEffect(() => {
    if (pokemonId) {
      fetchDetails(pokemonId);
    }
  }, [pokemonId]);

  useEffect(() => {
    if (details?.species?.url) {
      fetchEvolutionData();
    }
  }, [details, fetchEvolutionData]);

  const fetchDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setDetails(data);
    } catch (err: unknown) {
      setError('Failed to fetch data. Please try again.');
      console.error('Failed to fetch details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!pokemonId) {
    return null;
  }

  if (loading) {
    return (
      <div
        className="h-full flex items-center justify-center"
        data-testid="details-loading"
      >
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center" data-testid="error-message">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={detailsRef}
      className="h-full p-6 bg-white shadow-lg relative overflow-y-auto text-black rounded-2xl pokemon-details"
      data-testid="details-view"
    >
      <button
        onClick={handleCloseButton}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
                   rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200
                   text-gray-600 hover:text-gray-800"
        aria-label="Close details"
      >
        ✕
      </button>

      {details && (
        <div className="space-y-8">
          <header className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              {details.sprites.front_default ? (
                <img
                  src={details.sprites.front_default}
                  alt={details.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold capitalize mb-2">
                {details.name}
              </h2>
              <div className="flex flex-wrap gap-2">
                {details.types.map((type) => (
                  <span
                    key={type.type.name}
                    className="px-3 py-1 rounded-full text-white text-sm
                             transition-transform hover:scale-105"
                    style={{
                      backgroundColor: `var(--pokemon-type-${type.type.name}, #6B7280)`,
                    }}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* Evolution Chain Section */}
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">Evolution Chain</h3>
            {loadingEvolution ? (
              <div className="flex justify-center p-4">
                <Loader />
              </div>
            ) : evolutionChain.length > 0 ? (
              <div
                className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg
                            overflow-x-auto"
              >
                {evolutionChain.map((evo, index) => (
                  <React.Fragment key={`${evo.name}-${index}`}>
                    <div className="flex flex-col items-center min-w-[100px]">
                      {evolutionSprites[evo.name] ? (
                        <img
                          src={evolutionSprites[evo.name]}
                          alt={evo.name}
                          className="w-20 h-20"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm text-gray-400">
                            Loading...
                          </span>
                        </div>
                      )}
                      <p className="font-semibold capitalize text-center mt-2">
                        {evo.name}
                      </p>
                      {evo.min_level && (
                        <span className="text-sm text-gray-500">
                          Level {evo.min_level}
                        </span>
                      )}
                    </div>
                    {index < evolutionChain.length - 1 && (
                      <div className="text-2xl text-gray-400">→</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
                No evolution data available
              </p>
            )}
          </section>

          {/* Rest of the sections remain unchanged */}
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">Base Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {details &&
                details.stats.map((stat) => (
                  <div key={stat.stat.name} className="flex flex-col">
                    <span className="text-sm text-gray-600 capitalize">
                      {stat.stat.name.replace('-', ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex-grow h-2 bg-gray-200 rounded">
                        <div
                          className="h-full bg-blue-500 rounded"
                          style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {stat.base_stat}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">Characteristics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">
                  Height: {details?.height ? details.height / 10 : 'N/A'}m
                </p>
              </div>
              <div>
                <p className="font-medium">
                  Weight: {details?.weight ? details.weight / 10 : 'N/A'}kg
                </p>
              </div>
              <div>
                <span className="text-gray-600">Base Experience</span>
                <p className="font-medium">
                  {details?.base_experience ?? 'N/A'}
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">Abilities</h3>
            <div className="grid gap-2">
              {(details?.abilities || []).map((ability) => (
                <div
                  key={ability.ability.name}
                  className="p-2 bg-gray-50 rounded flex items-center justify-between"
                >
                  <span className="capitalize">
                    {ability.ability.name.replace('-', ' ')}
                  </span>
                  {ability.is_hidden && (
                    <span className="text-sm text-gray-500">
                      (Hidden Ability)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">Signature Moves</h3>
            <div className="grid gap-2">
              {(details?.moves || []).slice(0, 5).map((move) => (
                <div key={move.move.name} className="p-2 bg-gray-50 rounded">
                  <span className="capitalize">
                    {move.move.name.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Details;
