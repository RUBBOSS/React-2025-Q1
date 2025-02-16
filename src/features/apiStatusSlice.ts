import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { pokemonApi } from '../api/pokemonApi';

interface ApiStatusState {
  loading: boolean;
}

const initialState: ApiStatusState = { loading: false };

const apiStatusSlice = createSlice({
  name: 'apiStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        pokemonApi.endpoints.getPokemonList.matchPending,
        pokemonApi.endpoints.getPokemonByName.matchPending
      ),
      (state) => {
        state.loading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        pokemonApi.endpoints.getPokemonList.matchFulfilled,
        pokemonApi.endpoints.getPokemonList.matchRejected,
        pokemonApi.endpoints.getPokemonByName.matchFulfilled,
        pokemonApi.endpoints.getPokemonByName.matchRejected
      ),
      (state) => {
        state.loading = false;
      }
    );
  },
});

export default apiStatusSlice.reducer;
