import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  fetchPokemonDetails,
  fetchSpeciesDetails,
  fetchEvolutionChain,
} from '../api/pokeapi';
import Loader from './Loader';
import {
  PokemonDetails,
  ChainLink,
  SimplifiedEvolutionNode,
} from '../types/pokemon';

const Details = () => {
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

  useEffect(() => {
    if (pokemonId) {
      fetchDetails(pokemonId);
    }
  }, [pokemonId]);

  useEffect(() => {
    if (details?.species?.url) {
      fetchEvolutionData();
    }
  }, [details]);

  const fetchDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPokemonDetails(
        `https://pokeapi.co/api/v2/pokemon/${id}/`
      );
      setDetails(data);
    } catch (err) {
      setError('Failed to fetch Pokémon details');
      console.error('Failed to fetch details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvolutionData = async () => {
    if (!details?.species?.url) return;

    setLoadingEvolution(true);
    try {
      const speciesData = await fetchSpeciesDetails(details.species.url);
      const evolutionData = await fetchEvolutionChain(
        speciesData.evolution_chain.url
      );
      const chain = extractEvolutionChain(evolutionData.chain);

      // Fetch sprites for each evolution
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
  };

  const extractEvolutionChain = (
    chain: ChainLink,
    level = 1
  ): SimplifiedEvolutionNode[] => {
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
  };

  const handleClose = () => {
    searchParams.delete('details');
    setSearchParams(searchParams);
  };

  if (loading)
    return (
      <div className="h-full flex items-center justify-center">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="h-full p-6 bg-white shadow-lg">
        <div className="text-red-500 text-center">{error}</div>
        <button
          onClick={handleClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
        >
          Close
        </button>
      </div>
    );

  if (!details) return null;

  return (
    <div className="h-full p-6 bg-white shadow-lg relative overflow-y-auto">
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
      >
        ✕
      </button>

      {/* Header Section */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src={details.sprites.front_default}
          alt={details.name}
          className="w-32 h-32 object-contain"
        />
        <div>
          <h2 className="text-3xl font-bold capitalize mb-2">{details.name}</h2>
          <div className="flex gap-2">
            {details.types.map((type) => (
              <span
                key={type.type.name}
                className="px-3 py-1 rounded-full text-white bg-blue-500 text-sm"
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Base Stats Section */}
      <section className="mb-8">
        <h3 className="text-xl font-bold mb-4">Base Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          {details.stats.map((stat) => (
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
                <span className="text-sm font-medium">{stat.base_stat}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Evolution Chain Section */}
      <section className="mb-8">
        <h3 className="text-xl font-bold mb-4">Evolution Chain</h3>
        {loadingEvolution ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : evolutionChain.length > 0 ? (
          <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded">
            {evolutionChain.map((evo, index) => (
              <React.Fragment key={`${evo.name}-${index}`}>
                <div className="flex flex-col items-center">
                  <img
                    src={evolutionSprites[evo.name]}
                    alt={evo.name}
                    className="w-20 h-20"
                  />
                  <p className="font-semibold capitalize text-center">
                    {evo.name}
                  </p>
                </div>
                {index < evolutionChain.length - 1 && (
                  <div className="text-2xl text-gray-400">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            No evolution data available
          </p>
        )}
      </section>

      {/* Physical Characteristics */}
      <section className="mb-8">
        <h3 className="text-xl font-bold mb-4">Characteristics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-600">Height</span>
            <p className="font-medium">{details.height / 10}m</p>
          </div>
          <div>
            <span className="text-gray-600">Weight</span>
            <p className="font-medium">{details.weight / 10}kg</p>
          </div>
          <div>
            <span className="text-gray-600">Base Experience</span>
            <p className="font-medium">{details.base_experience}</p>
          </div>
        </div>
      </section>

      {/* Abilities Section */}
      <section className="mb-8">
        <h3 className="text-xl font-bold mb-4">Abilities</h3>
        <div className="grid gap-2">
          {details.abilities.map((ability) => (
            <div
              key={ability.ability.name}
              className="p-2 bg-gray-50 rounded flex items-center justify-between"
            >
              <span className="capitalize">
                {ability.ability.name.replace('-', ' ')}
              </span>
              {ability.is_hidden && (
                <span className="text-sm text-gray-500">(Hidden Ability)</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Moves Section */}
      <section className="mb-8">
        <h3 className="text-xl font-bold mb-4">Signature Moves</h3>
        <div className="grid gap-2">
          {details.moves.slice(0, 5).map((move) => (
            <div key={move.move.name} className="p-2 bg-gray-50 rounded">
              <span className="capitalize">
                {move.move.name.replace('-', ' ')}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Details;
