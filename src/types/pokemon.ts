export interface Ability {
  ability: {
    name: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface Type {
  type: {
    name: string;
  };
}

export interface Stat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface Move {
  move: {
    name: string;
  };
}

export interface GameIndex {
  game_index: number;
  version: {
    name: string;
  };
}

export interface HeldItem {
  item: {
    name: string;
  };
}

export interface PokemonDetails {
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

export interface SpeciesDetails {
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

export interface EvolutionChain {
  chain: EvolutionNode;
}

export interface EvolutionNode {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionNode[];
}
