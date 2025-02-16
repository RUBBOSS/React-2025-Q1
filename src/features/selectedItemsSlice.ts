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

const loadSelectedItems = (): SelectedItemsState => {
  try {
    const savedItems = localStorage.getItem('selectedItems');
    return savedItems ? JSON.parse(savedItems) : { items: {} };
  } catch {
    return { items: {} };
  }
};

const initialState: SelectedItemsState = loadSelectedItems();

export const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.items[action.payload.name] = action.payload;
      localStorage.setItem('selectedItems', JSON.stringify(state));
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const { [action.payload]: removed, ...rest } = state.items;
      console.log(removed);
      state.items = rest;
      localStorage.setItem('selectedItems', JSON.stringify(state));
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
        localStorage.setItem('selectedItems', JSON.stringify(state));
      }
    },
    clearSelected: (state) => {
      state.items = {};
      localStorage.setItem('selectedItems', JSON.stringify(state));
    },
  },
});

export const { addItem, removeItem, updateItemDetails, clearSelected } =
  selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
