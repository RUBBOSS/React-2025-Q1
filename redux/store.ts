import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { pokemonApi } from './services/pokemonApi';
import selectedPokemonReducer from './slices/selectedPokemonSlice';
import paginationReducer from './slices/paginationSlice';
const apiReducerPath = 'pokemonApi';
export const store = configureStore({
  reducer: {
    [apiReducerPath]: pokemonApi.reducer,
    selectedPokemon: selectedPokemonReducer,
    pagination: paginationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
