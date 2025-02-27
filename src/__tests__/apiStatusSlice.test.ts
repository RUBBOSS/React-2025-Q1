import { describe, it, expect } from 'vitest';
import reducer, {
  setLoading,
  setError,
  clearError,
} from '../features/apiStatusSlice';

describe('apiStatusSlice', () => {
  const initialState = {
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setLoading', () => {
    const nextState = reducer(initialState, setLoading(true));
    expect(nextState).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should handle setError', () => {
    const error = 'Test error';
    const nextState = reducer(initialState, setError(error));
    expect(nextState).toEqual({
      ...initialState,
      error,
    });
  });

  it('should handle clearError', () => {
    const stateWithError = {
      loading: false,
      error: 'Test error',
    };
    const nextState = reducer(stateWithError, clearError());
    expect(nextState).toEqual(initialState);
  });
});
