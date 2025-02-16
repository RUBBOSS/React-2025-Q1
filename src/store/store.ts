import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from '../features/selectedItemsSlice';
import { pokemonApi } from '../api/pokemonApi';
import apiStatusReducer from '../features/apiStatusSlice';

export const store = configureStore({
  reducer: {
    selectedItems: selectedItemsReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    apiStatus: apiStatusReducer, // added apiStatus slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
