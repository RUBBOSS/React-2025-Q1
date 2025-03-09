import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
interface PokemonDetailState {
  selectedPokemonId: number | null;
  showDetails: boolean;
}
const initialState: PokemonDetailState = {
  selectedPokemonId: null,
  showDetails: false,
};
export const pokemonDetailSlice = createSlice({
  name: 'pokemonDetail',
  initialState,
  reducers: {
    setPokemonDetail: (state, action: PayloadAction<number>) => {
      state.selectedPokemonId = action.payload;
      state.showDetails = true;
    },
    clearPokemonDetail: (state) => {
      state.selectedPokemonId = null;
      state.showDetails = false;
    },
    toggleDetailView: (state) => {
      state.showDetails = !state.showDetails;
    },
  },
});
export const { setPokemonDetail, clearPokemonDetail, toggleDetailView } = pokemonDetailSlice.actions;
export const selectSelectedPokemonId = (state: RootState) => state.pokemonDetail.selectedPokemonId;
export const selectShowDetails = (state: RootState) => state.pokemonDetail.showDetails;
export default pokemonDetailSlice.reducer;
