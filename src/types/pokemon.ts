export interface Ability {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface Type {
  type: {
    name: string;
    url: string;
  };
  slot: number;
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface Move {
  move: {
    name: string;
    url: string;
  };
}

export interface GameIndex {
  game_index: number;
  version: {
    name: string;
    url: string;
  };
}

export interface HeldItem {
  item: {
    name: string;
  };
}

export interface PokemonDetails {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    back_default: string;
  };
  stats: Stat[];
  types: Type[];
  abilities: Ability[];
  moves: Move[];
  game_indices: GameIndex[];
  held_items: HeldItem[];
  location_area_encounters: string;
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

export interface EvolutionDetail {
  min_level?: number;
  trigger: {
    name: string;
    url: string;
  };
}

export interface ChainLink {
  is_baby: boolean;
  species: {
    name: string;
    url: string;
  };
  evolution_details: EvolutionDetail[] | null;
  evolves_to: ChainLink[];
}

export interface EvolutionChainResponse {
  chain: ChainLink;
}

export interface SimplifiedEvolutionNode {
  name: string;
  level: number;
  min_level?: number;
  trigger?: string;
}
