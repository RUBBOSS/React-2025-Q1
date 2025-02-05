import React, { useState } from 'react';
import axios from 'axios';

interface Ability {
  ability: {
    name: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface Type {
  type: {
    name: string;
  };
}

interface Stat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface Move {
  move: {
    name: string;
  };
}

interface GameIndex {
  game_index: number;
  version: {
    name: string;
  };
}

interface HeldItem {
  item: {
    name: string;
  };
}

interface PokemonDetails {
  height: number;
  weight: number;
  base_experience: number;
  types: Type[];
  abilities: Ability[];
  stats: Stat[];
  moves: Move[];
  game_indices: GameIndex[];
  held_items: HeldItem[];
  location_area_encounters: string;
  sprites: {
    front_default: string;
  };
  species: {
    name: string;
    url: string;
  };
}

interface SpeciesDetails {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }>;
  habitat: {
    name: string;
  } | null;
  evolution_chain: {
    url: string;
  };
}

interface EvolutionChain {
  chain: EvolutionNode;
}

interface EvolutionNode {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionNode[];
}

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
        const response = await axios.get<PokemonDetails>(url);
        setDetails(response.data);
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

  const fetchSpeciesDetails = async (): Promise<SpeciesDetails | undefined> => {
    if (details?.species.url) {
      setLoadingState((prev) => ({ ...prev, species: true }));
      try {
        const response = await axios.get<SpeciesDetails>(details.species.url);
        setSpeciesDetails(response.data);
        return response.data;
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

  const fetchEvolutionChain = async () => {
    const currentSpeciesDetails =
      speciesDetails || (await fetchSpeciesDetails()) || null;
    if (currentSpeciesDetails?.evolution_chain.url) {
      setLoadingState((prev) => ({ ...prev, evolution: true }));
      try {
        const response = await axios.get<EvolutionChain>(
          currentSpeciesDetails.evolution_chain.url
        );
        const chainNames = getEvolutionChainNames(response.data.chain);
        setEvolutionChain(chainNames);
      } catch {
        setError('Failed to fetch evolution chain.');
      } finally {
        setLoadingState((prev) => ({ ...prev, evolution: false }));
      }
    }
  };

  const fetchLocationEncounters = async () => {
    if (details?.location_area_encounters) {
      setLoadingState((prev) => ({ ...prev, location: true }));
      try {
        const response = await axios.get(details.location_area_encounters);
        setLocationEncounters(response.data);
      } catch {
        setError('Failed to fetch location encounters.');
      } finally {
        setLoadingState((prev) => ({ ...prev, location: false }));
      }
    }
  };

  return (
    <div className="cards-container">
      <div className="card">
        <div className="card-header">
          <h3>{name}</h3>
          <button className="toggle-button" onClick={toggleDetails}>
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
        </div>

        {loadingState.details && (
          <p className="loading-text">Loading Pokémon details...</p>
        )}
        {error && <p className="error-text">{error}</p>}

        {showDetails && details && (
          <div className="details">
            <p>Height: {details.height}</p>
            <p>Weight: {details.weight}</p>
            <p>Base Experience: {details.base_experience}</p>
            <p>Types: {details.types.map((t) => t.type.name).join(', ')}</p>
            <p>
              Abilities:{' '}
              {details.abilities.map((a) => a.ability.name).join(', ')}
            </p>
            <ul>
              {details.stats.map((s) => (
                <li key={s.stat.name}>
                  {s.stat.name}: {s.base_stat}
                </li>
              ))}
            </ul>
            <ul>
              {details.moves.slice(0, 5).map((m) => (
                <li key={m.move.name}>{m.move.name}</li>
              ))}
            </ul>
            <ul>
              {details.game_indices.slice(0, 3).map((gi, index) => (
                <li key={index}>
                  {gi.version.name}: {gi.game_index}
                </li>
              ))}
            </ul>
            {details.held_items?.length && (
              <ul>
                {details.held_items.map((item, index) => (
                  <li key={index}>{item.item.name}</li>
                ))}
              </ul>
            )}
            <img src={details.sprites.front_default} alt={name} />

            <div className="location-section">
              <h4>Location Encounters</h4>
              <button
                className="load-button"
                onClick={fetchLocationEncounters}
                disabled={loadingState.location}
              >
                {loadingState.location
                  ? 'Loading...'
                  : 'Load Location Encounters'}
              </button>
              {locationEncounters?.length ? (
                <ul>
                  {locationEncounters.map((loc, index) => (
                    <li key={index}>
                      {loc.location_area.name} -{' '}
                      {loc.version_details?.[0]?.encounter_details?.[0]
                        ?.chance || 0}
                    </li>
                  ))}
                </ul>
              ) : (
                !loadingState.location && <p>No location encounters found.</p>
              )}
            </div>

            <div className="evolution-section">
              <h4>Evolution Chain</h4>
              <button
                className="load-button"
                onClick={fetchEvolutionChain}
                disabled={loadingState.evolution}
              >
                {loadingState.evolution
                  ? 'Loading Evolution Chain...'
                  : 'Load Evolution Chain'}
              </button>
              {evolutionChain?.length ? (
                <ul>
                  {evolutionChain.map((poke, index) => (
                    <li key={index}>{poke}</li>
                  ))}
                </ul>
              ) : (
                !loadingState.evolution && (
                  <p>No evolution chain data available.</p>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
