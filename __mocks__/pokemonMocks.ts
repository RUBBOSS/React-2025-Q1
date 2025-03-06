import { Pokemon } from '../types/pokemon';

export const mockPokemonData: Pokemon[] = [
  { 
    id: 1, 
    name: 'bulbasaur', 
    image: 'bulbasaur.png',
    height: 7,
    weight: 69, 
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
  },
  { 
    id: 25, 
    name: 'pikachu', 
    image: 'pikachu.png',
    height: 4,
    weight: 60, 
    types: [{ type: { name: 'electric' } }],
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
  }
];

export const mockPokemonApiResponse = {
  id: 25,
  name: 'pikachu',
  height: 40,
  weight: 60,
  types: [{ type: { name: 'electric' } }],
  abilities: [{ ability: { name: 'static' } }],
  stats: [{ base_stat: 55, stat: { name: 'attack' } }],
  sprites: {
    front_default: 'pikachu.png',
    back_default: 'pikachu-back.png',
    front_shiny: 'pikachu-shiny.png',
    other: { 
      'official-artwork': { 
        front_default: 'pikachu-official.png' 
      } 
    }
  },
  species: { url: 'https://pokeapi.co/api/v2/pokemon-species/25/' }
};

export const mockSpeciesData = {
  flavor_text_entries: [
    { language: { name: 'en' }, flavor_text: 'This is a description of the Pokemon.' }
  ]
};
