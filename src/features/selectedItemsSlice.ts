import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Item {
  name: string;
  description?: string;
  url: string;
  details?: Record<string, string | number | boolean>;
}

interface SelectedItemsState {
  items: Record<string, Item>;
}

const initialState: SelectedItemsState = {
  items: {},
};

export const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.items[action.payload.name] = action.payload;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const { [action.payload]: removed, ...rest } = state.items;
      console.log(removed);
      state.items = rest;
    },
    updateItemDetails: (
      state,
      action: PayloadAction<{ name: string; details: Partial<Item> }>
    ) => {
      if (state.items[action.payload.name]) {
        state.items[action.payload.name] = {
          ...state.items[action.payload.name],
          ...action.payload.details,
        };
      }
    },
    clearSelected: (state) => {
      state.items = {};
    },
  },
});

export const { addItem, removeItem, updateItemDetails, clearSelected } =
  selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
