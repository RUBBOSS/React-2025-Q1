import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Item {
  name: string;
  url: string;
  description: string;
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
      const { [action.payload]: _, ...rest } = state.items;
      console.log(_);
      state.items = rest;
      localStorage.setItem('selectedItems', JSON.stringify(state));
    },
    updateItemDetails: (
      state,
      action: PayloadAction<{ name: string; details: Partial<Item> }>
    ) => {
      const { name } = action.payload;
      if (state.items[name]) {
        state.items[name] = {
          ...state.items[name],
          ...action.payload.details,
        };
        localStorage.setItem('selectedItems', JSON.stringify(state));
      }
    },
    clearItems: (state) => {
      state.items = {};
      localStorage.setItem('selectedItems', JSON.stringify(state));
    },
    toggleItem: (state, action: PayloadAction<Item>) => {
      const { name } = action.payload;
      if (name in state.items) {
        const { [name]: _, ...rest } = state.items;
        console.log(_);
        state.items = rest;
      } else {
        state.items[name] = action.payload;
      }
      localStorage.setItem('selectedItems', JSON.stringify(state));
    },
  },
});

export const {
  addItem,
  removeItem,
  updateItemDetails,
  clearItems,
  toggleItem,
} = selectedItemsSlice.actions;

export default selectedItemsSlice.reducer;
