import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Item {
  name: string;
  description?: string;
  url: string;
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
    clearSelected: (state) => {
      state.items = {};
    },
  },
});

export const { addItem, removeItem, clearSelected } =
  selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
