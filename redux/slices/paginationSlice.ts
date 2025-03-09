import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
}
const initialState: PaginationState = {
  currentPage: 1,
  itemsPerPage: 12,
  searchTerm: '',
};
export const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
  },
});
export const { setCurrentPage, setItemsPerPage, setSearchTerm } = paginationSlice.actions;
export const selectCurrentPage = (state: RootState) => state.pagination.currentPage;
export const selectItemsPerPage = (state: RootState) => state.pagination.itemsPerPage;
export const selectSearchTerm = (state: RootState) => state.pagination.searchTerm;
export default paginationSlice.reducer;
