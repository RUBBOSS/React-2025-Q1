import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isFlyoutOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UIState = {
  isFlyoutOpen: false,
  isLoading: false,
  error: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openFlyout: state => {
      state.isFlyoutOpen = true;
    },
    closeFlyout: state => {
      state.isFlyoutOpen = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { openFlyout, closeFlyout, setLoading, setError } =
  uiSlice.actions;
export default uiSlice.reducer;
