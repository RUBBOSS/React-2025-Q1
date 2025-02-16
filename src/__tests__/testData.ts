export const mockPokemonList = [
  {
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
  },
  {
    name: 'ivysaur',
    url: 'https://pokeapi.co/api/v2/pokemon/2/',
  },
];

export const defaultState = {
  pokemon: {
    items: [],
    selectedItems: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    searchTerm: '',
  },
};
