import { Component } from 'react';
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

interface CardState {
  showDetails: boolean;
  details: PokemonDetails | null;
  speciesDetails: SpeciesDetails | null;
  evolutionChain: string[] | null;
  locationEncounters: Array<{
    location_area: { name: string };
    version_details: { encounter_details: { chance: number }[] }[];
  }> | null;
  loading: boolean;
  speciesLoading: boolean;
  evolutionLoading: boolean;
  locationLoading: boolean;
  error: string | null;
  evolutionError: string | null;
  locationError: string | null;
}

class Card extends Component<CardProps, CardState> {
  constructor(props: CardProps) {
    super(props);
    this.state = {
      speciesLoading: false,
      showDetails: false,
      details: null,
      speciesDetails: null,
      evolutionChain: null,
      locationEncounters: null,
      loading: false,
      evolutionLoading: false,
      locationLoading: false,
      error: null,
      evolutionError: null,
      locationError: null,
    };
  }

  toggleDetails = async () => {
    const { showDetails } = this.state;
    const { url } = this.props;

    if (!showDetails) {
      this.setState({ loading: true, error: null });
      try {
        const response = await axios.get<PokemonDetails>(url);
        this.setState({
          details: response.data,
          loading: false,
          showDetails: true,
        });
      } catch {
        this.setState({
          error: 'Failed to fetch Pokémon details.',
          loading: false,
        });
      }
    } else {
      this.setState({ showDetails: false });
    }
  };

  fetchSpeciesDetails = async (): Promise<SpeciesDetails | undefined> => {
    const { details } = this.state;
    if (details && details.species.url) {
      this.setState({ speciesLoading: true });
      try {
        const response = await axios.get<SpeciesDetails>(details.species.url);
        this.setState({ speciesDetails: response.data, speciesLoading: false });
        return response.data;
      } catch {
        this.setState({
          error: 'Failed to fetch species details.',
          speciesLoading: false,
        });
        return undefined;
      }
    }
  };

  getEvolutionChainNames = (node: EvolutionNode): string[] => {
    let names = [node.species.name];
    node.evolves_to.forEach((child) => {
      names = names.concat(this.getEvolutionChainNames(child));
    });
    return names;
  };

  fetchEvolutionChain = async () => {
    let speciesDetails = this.state.speciesDetails;
    if (!speciesDetails) {
      speciesDetails = (await this.fetchSpeciesDetails()) || null;
    }
    if (speciesDetails && speciesDetails.evolution_chain.url) {
      this.setState({ evolutionLoading: true, evolutionError: null });
      try {
        const response = await axios.get<EvolutionChain>(
          speciesDetails.evolution_chain.url
        );
        const chainNames = this.getEvolutionChainNames(response.data.chain);
        this.setState({ evolutionChain: chainNames, evolutionLoading: false });
      } catch {
        this.setState({
          evolutionError: 'Failed to fetch evolution chain.',
          evolutionLoading: false,
        });
      }
    }
  };

  fetchLocationEncounters = async () => {
    const { details } = this.state;
    if (details && details.location_area_encounters) {
      this.setState({ locationLoading: true, locationError: null });
      try {
        const response = await axios.get<
          Array<{
            location_area: { name: string };
            version_details: { encounter_details: { chance: number }[] }[];
          }>
        >(details.location_area_encounters);
        this.setState({
          locationEncounters: response.data,
          locationLoading: false,
        });
      } catch {
        this.setState({
          locationError: 'Failed to fetch location encounters.',
          locationLoading: false,
        });
      }
    }
  };

  render() {
    const { name } = this.props;
    const {
      showDetails,
      details,
      loading,
      error,
      evolutionLoading,
      evolutionChain,
      locationEncounters,
      locationLoading,
      evolutionError,
      locationError,
    } = this.state;

    return (
      <div className="cards-container">
        <div className="card">
          <div className="card-header">
            <h3>{name}</h3>
            <button className="toggle-button" onClick={this.toggleDetails}>
              {showDetails ? 'Hide Details' : 'View Details'}
            </button>
          </div>

          {loading && (
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
              <p>Stats:</p>
              <ul>
                {details.stats.map((s) => (
                  <li key={s.stat.name}>
                    {s.stat.name}: {s.base_stat}
                  </li>
                ))}
              </ul>
              <p>Moves (first 5):</p>
              <ul>
                {details.moves.slice(0, 5).map((m) => (
                  <li key={m.move.name}>{m.move.name}</li>
                ))}
              </ul>
              <p>Game Indices:</p>
              <ul>
                {details.game_indices.slice(0, 3).map((gi, index) => (
                  <li key={index}>
                    {gi.version.name}: {gi.game_index}
                  </li>
                ))}
              </ul>
              {details.held_items && details.held_items.length > 0 && (
                <>
                  <p>Held Items:</p>
                  <ul>
                    {details.held_items.map((item, index) => (
                      <li key={index}>{item.item.name}</li>
                    ))}
                  </ul>
                </>
              )}
              <img
                className="pokemon-image"
                src={details.sprites.front_default}
                alt={name}
              />

              <div className="location-section">
                <h4>Location Encounters</h4>
                <button
                  className="load-button"
                  onClick={this.fetchLocationEncounters}
                  disabled={locationLoading}
                >
                  {locationLoading ? 'Loading...' : 'Load Location Encounters'}
                </button>
                {locationError && <p className="error-text">{locationError}</p>}
                {locationEncounters && locationEncounters.length > 0 ? (
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
                  !locationLoading && <p>No location encounters found.</p>
                )}
              </div>

              <div className="evolution-section">
                <h4>Evolution Chain</h4>
                <button
                  className="load-button"
                  onClick={this.fetchEvolutionChain}
                  disabled={evolutionLoading}
                >
                  {evolutionLoading
                    ? 'Loading Evolution Chain...'
                    : 'Load Evolution Chain'}
                </button>
                {evolutionError && (
                  <p className="error-text">{evolutionError}</p>
                )}
                {evolutionChain && evolutionChain.length > 0 ? (
                  <ul>
                    {evolutionChain.map((poke, index) => (
                      <li key={index}>{poke}</li>
                    ))}
                  </ul>
                ) : (
                  !evolutionLoading && <p>No evolution chain data available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Card;
