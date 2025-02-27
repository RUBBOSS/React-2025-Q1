import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from '../features/selectedItemsSlice';
import { pokemonApi } from '../api/pokemonApi';
import apiStatusReducer from '../features/apiStatusSlice';
import pokemonReducer from './mockPokemonSlice';

export const store = configureStore({
  reducer: {
    selectedItems: selectedItemsReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    apiStatus: apiStatusReducer,
    pokemon: pokemonReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
