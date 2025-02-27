import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ApiStatusState {
  loading: boolean;
  error: string | null;
}

const initialState: ApiStatusState = {
  loading: false,
  error: null,
};

const apiStatusSlice = createSlice({
  name: 'apiStatus',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setLoading, setError, clearError } = apiStatusSlice.actions;
export default apiStatusSlice.reducer;
