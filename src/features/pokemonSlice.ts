import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonState {
  items: Pokemon[];
  selectedItems: string[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
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

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Pokemon[]>) => {
      state.items = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setItems, setLoading, setError, setPage } = pokemonSlice.actions;
export default pokemonSlice.reducer;
