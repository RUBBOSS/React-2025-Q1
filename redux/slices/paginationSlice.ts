import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Define the state interface
interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
}

// Define the initial state
const initialState: PaginationState = {
  currentPage: 1,
  itemsPerPage: 12,
  searchTerm: '',
};

// Create the slice
export const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      // Reset to page 1 when changing items per page
      state.currentPage = 1;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      // Reset to page 1 when searching
      state.currentPage = 1;
    },
  },
});

// Export actions
export const { setCurrentPage, setItemsPerPage, setSearchTerm } = paginationSlice.actions;

// Export selectors
export const selectCurrentPage = (state: RootState) => state.pagination.currentPage;
export const selectItemsPerPage = (state: RootState) => state.pagination.itemsPerPage;
export const selectSearchTerm = (state: RootState) => state.pagination.searchTerm;

// Export reducer
export default paginationSlice.reducer;
