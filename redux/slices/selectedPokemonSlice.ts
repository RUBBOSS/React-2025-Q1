import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Pokemon } from '../../types/pokemon';

interface SelectedPokemonState {
  ids: number[];
  items: Record<number, Pokemon>; 
}

const initialState: SelectedPokemonState = {
  ids: [],
  items: {},
};

export const selectedPokemonSlice = createSlice({
  name: 'selectedPokemon',
  initialState,
  reducers: {
    toggleSelection: (state, action: PayloadAction<{id: number, pokemon: Pokemon}>) => {
      const { id, pokemon } = action.payload;
      const index = state.ids.indexOf(id);
      if (index > -1) {
        state.ids.splice(index, 1);
        delete state.items[id];
      } else {
        state.ids.push(id);
        state.items[id] = pokemon;
      }
    },
    clearSelection: (state) => {
      state.ids = [];
      state.items = {};
    },
    addPokemonData: (state, action: PayloadAction<Pokemon>) => {
      const pokemon = action.payload;
      if (state.ids.includes(pokemon.id)) {
        state.items[pokemon.id] = pokemon;
      }
    },
    clearAllSelections: (state) => {
      state.ids = [];
      state.items = {};
    }
  },
});

export const { 
  toggleSelection, 
  addPokemonData, 
  clearAllSelections,
  clearSelection 
} = selectedPokemonSlice.actions;

export const selectSelectedPokemonIds = (state: RootState) => state.selectedPokemon.ids;
export const selectSelectedPokemonItems = (state: RootState) => state.selectedPokemon.items;
export const selectIsSelected = (state: RootState, id: number) => 
  state.selectedPokemon.ids.includes(id);
export const selectSelectedCount = (state: RootState) => 
  state.selectedPokemon.ids.length;

export default selectedPokemonSlice.reducer;
