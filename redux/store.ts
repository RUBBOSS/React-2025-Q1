import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { pokemonApi } from './services/pokemonApi';
import selectedPokemonReducer from './slices/selectedPokemonSlice';
import paginationReducer from './slices/paginationSlice';

// Fix for potential circular dependency
const apiReducerPath = 'pokemonApi';

export const store = configureStore({
  reducer: {
    // Use string literal instead of pokemonApi.reducerPath to avoid circular dependency issues
    [apiReducerPath]: pokemonApi.reducer,
    selectedPokemon: selectedPokemonReducer,
    pagination: paginationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
