import { createSlice } from '@reduxjs/toolkit';

export interface Pokemon {
  id: string;
  name: string;
  url: string;
}

export interface PokemonState {
  items: Pokemon[];
  selectedItems: string[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
}

export interface RootState {
  pokemon: PokemonState;
}

const initialState: PokemonState = {
  items: [],
  selectedItems: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  searchTerm: '',
};

const mockPokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    toggleSelected: (state, action) => {
      const itemId = action.payload;
      const index = state.selectedItems.indexOf(itemId);
      if (index === -1) {
        state.selectedItems.push(itemId);
      } else {
        state.selectedItems.splice(index, 1);
      }
    },
  },
});

export const { setLoading, setError, setItems, toggleSelected } =
  mockPokemonSlice.actions;
export default mockPokemonSlice.reducer;
