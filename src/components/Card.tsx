import React, { useState } from 'react';
import {
  fetchPokemonDetails,
  fetchSpeciesDetails,
  fetchEvolutionChain,
  fetchLocationEncounters,
} from '../api/pokeapi';
import {
  PokemonDetails,
  SpeciesDetails,
  EvolutionNode,
} from '../types/pokemon';

interface CardProps {
  name: string;
  url: string;
}

const Card: React.FC<CardProps> = ({ name, url }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [speciesDetails, setSpeciesDetails] = useState<SpeciesDetails | null>(
    null
  );
  const [evolutionChain, setEvolutionChain] = useState<string[] | null>(null);
  const [locationEncounters, setLocationEncounters] = useState<Array<{
    location_area: { name: string };
    version_details: { encounter_details: { chance: number }[] }[];
  }> | null>(null);

  const [loadingState, setLoadingState] = useState({
    details: false,
    species: false,
    evolution: false,
    location: false,
  });

  const [error, setError] = useState<string | null>(null);

  const toggleDetails = async () => {
    if (!showDetails) {
      setLoadingState((prev) => ({ ...prev, details: true }));
      setError(null);
      try {
        const data = await fetchPokemonDetails(url);
        setDetails(data);
      } catch {
        setError('Failed to fetch Pokémon details.');
      } finally {
        setLoadingState((prev) => ({ ...prev, details: false }));
      }
      setShowDetails(true);
    } else {
      setShowDetails(false);
    }
  };

  const fetchSpecies = async (): Promise<SpeciesDetails | undefined> => {
    if (details?.species.url) {
      setLoadingState((prev) => ({ ...prev, species: true }));
      try {
        const data = await fetchSpeciesDetails(details.species.url);
        setSpeciesDetails(data);
        return data;
      } catch {
        setError('Failed to fetch species details.');
        return undefined;
      } finally {
        setLoadingState((prev) => ({ ...prev, species: false }));
      }
    }
  };

  const getEvolutionChainNames = (node: EvolutionNode): string[] => {
    let names = [node.species.name];
    node.evolves_to.forEach((child) => {
      names = names.concat(getEvolutionChainNames(child));
    });
    return names;
  };

  const fetchEvolution = async () => {
    const currentSpecies = speciesDetails || (await fetchSpecies());
    if (currentSpecies?.evolution_chain.url) {
      setLoadingState((prev) => ({ ...prev, evolution: true }));
      try {
        const chainData = await fetchEvolutionChain(
          currentSpecies.evolution_chain.url
        );
        const chainNames = getEvolutionChainNames(chainData.chain);
        setEvolutionChain(chainNames);
      } catch {
        setError('Failed to fetch evolution chain.');
      } finally {
        setLoadingState((prev) => ({ ...prev, evolution: false }));
      }
    }
  };

  const fetchLocation = async () => {
    if (details?.location_area_encounters) {
      setLoadingState((prev) => ({ ...prev, location: true }));
      try {
        const data = await fetchLocationEncounters(
          details.location_area_encounters
        );
        setLocationEncounters(data);
      } catch {
        setError('Failed to fetch location encounters.');
      } finally {
        setLoadingState((prev) => ({ ...prev, location: false }));
      }
    }
  };

  return (
    <article className="bg-white text-gray-900 rounded-xl shadow-lg p-6 m-4 transition duration-500 transform hover:scale-105">
      <header className="flex items-center justify-between border-b pb-2 mb-4">
        <h3 className="text-2xl font-bold">{name}</h3>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={toggleDetails}
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
      </header>
      {loadingState.details && (
        <p className="text-center text-gray-500">Loading Pokémon details...</p>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {showDetails && details && (
        <section className="space-y-4">
          {/* Removed animate-pulse from here */}
          <div className="flex flex-wrap justify-around">
            <p className="text-lg">
              <span className="font-semibold">Height:</span> {details.height}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Weight:</span> {details.weight}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Experience:</span>{' '}
              {details.base_experience}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold">Types:</p>
            <p className="ml-2">
              {details.types.map((t) => t.type.name).join(', ')}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold">Abilities:</p>
            <p className="ml-2">
              {details.abilities.map((a) => a.ability.name).join(', ')}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold">Stats:</p>
            <ul className="list-disc list-inside ml-4">
              {details.stats.map((s) => (
                <li key={s.stat.name}>
                  {s.stat.name}: {s.base_stat}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-lg font-semibold">Moves:</p>
            <ul className="list-disc list-inside ml-4">
              {details.moves.slice(0, 5).map((m) => (
                <li key={m.move.name}>{m.move.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-lg font-semibold">Game Indices:</p>
            <ul className="list-disc list-inside ml-4">
              {details.game_indices.slice(0, 3).map((gi, index) => (
                <li key={index}>
                  {gi.version.name}: {gi.game_index}
                </li>
              ))}
            </ul>
          </div>
          {details.held_items?.length && (
            <div>
              <p className="text-lg font-semibold">Held Items:</p>
              <ul className="list-disc list-inside ml-4">
                {details.held_items.map((item, index) => (
                  <li key={index}>{item.item.name}</li>
                ))}
              </ul>
            </div>
          )}
          <figure className="flex justify-center">
            <img
              className="rounded shadow-md"
              src={details.sprites.front_default}
              alt={name}
            />
          </figure>
          <section className="border-t pt-4">
            <h4 className="text-xl font-bold">Location Encounters</h4>
            <button
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded transition hover:bg-green-600"
              onClick={fetchLocation}
              disabled={loadingState.location}
            >
              {loadingState.location
                ? 'Loading...'
                : 'Load Location Encounters'}
            </button>
            {locationEncounters?.length ? (
              <ul className="list-disc ml-4">
                {locationEncounters.map((loc, index) => (
                  <li key={index}>
                    {loc.location_area.name} -{' '}
                    {loc.version_details?.[0]?.encounter_details?.[0]?.chance ||
                      0}
                  </li>
                ))}
              </ul>
            ) : (
              !loadingState.location && (
                <p className="ml-4">No location encounters found.</p>
              )
            )}
          </section>
          <section className="border-t pt-4">
            <h4 className="text-xl font-bold">Evolution Chain</h4>
            <button
              className="mt-2 px-4 py-2 bg-purple-500 text-white rounded transition hover:bg-purple-600"
              onClick={fetchEvolution}
              disabled={loadingState.evolution}
            >
              {loadingState.evolution
                ? 'Loading Evolution Chain...'
                : 'Load Evolution Chain'}
            </button>
            {evolutionChain?.length ? (
              <ul className="list-disc ml-4">
                {evolutionChain.map((poke, index) => (
                  <li key={index}>{poke}</li>
                ))}
              </ul>
            ) : (
              !loadingState.evolution && (
                <p className="ml-4">No evolution chain data available.</p>
              )
            )}
          </section>
        </section>
      )}
    </article>
  );
};

export default Card;
