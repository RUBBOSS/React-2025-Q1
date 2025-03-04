import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Pokemon } from '../services/pokemonApi';

// Define selected items state
interface SelectedPokemonState {
  ids: number[];
  items: Record<number, Pokemon>; // Store full Pokemon objects
}

// Initial state
const initialState: SelectedPokemonState = {
  ids: [],
  items: {},
};

// Create the slice
export const selectedPokemonSlice = createSlice({
  name: 'selectedPokemon',
  initialState,
  reducers: {
    // Toggle Pokemon selection
    toggleSelection: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const index = state.ids.indexOf(id);
      
      if (index > -1) {
        // Unselect: Remove from ids array and items object
        state.ids.splice(index, 1);
        delete state.items[id];
      } else {
        // Select: Add to ids array
        state.ids.push(id);
      }
    },
    
    // Add Pokemon data to selected items
    addPokemonData: (state, action: PayloadAction<Pokemon>) => {
      const pokemon = action.payload;
      // Make sure this Pokemon is selected before adding data
      if (state.ids.includes(pokemon.id)) {
        state.items[pokemon.id] = pokemon;
      }
    },
    
    // Clear all selections
    clearAllSelections: (state) => {
      state.ids = [];
      state.items = {};
    }
  },
});

// Export actions
export const { 
  toggleSelection, 
  addPokemonData, 
  clearAllSelections 
} = selectedPokemonSlice.actions;

// Export selectors
export const selectSelectedPokemonIds = (state: RootState) => state.selectedPokemon.ids;
export const selectSelectedPokemonItems = (state: RootState) => state.selectedPokemon.items;
export const selectIsSelected = (state: RootState, id: number) => 
  state.selectedPokemon.ids.includes(id);
export const selectSelectedCount = (state: RootState) => 
  state.selectedPokemon.ids.length;

export default selectedPokemonSlice.reducer;
