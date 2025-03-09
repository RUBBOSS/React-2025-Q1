import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from './slices/selectedItemsSlice';
import uiReducer from './slices/uiSlice';
import mockPokemonReducer from './slices/mockPokemonSlice';
export const store = configureStore({
  reducer: {
    selectedItems: selectedItemsReducer,
    ui: uiReducer,
    pokemon: mockPokemonReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
