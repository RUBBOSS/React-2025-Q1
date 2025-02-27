import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '../../api/pokemonApi';

describe('Store Setup', () => {
  it('should include the pokemonApi reducer in the state', () => {
    const store = configureStore({
      reducer: { [pokemonApi.reducerPath]: pokemonApi.reducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokemonApi.middleware),
    });
    const state = store.getState();
    expect(state[pokemonApi.reducerPath]).toBeDefined();
  });

  it('should have empty API sub-states after an unknown action', () => {
    const store = configureStore({
      reducer: { [pokemonApi.reducerPath]: pokemonApi.reducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokemonApi.middleware),
    });
    store.dispatch({ type: 'UNKNOWN_ACTION' });
    const nextState = store.getState();
    expect(nextState[pokemonApi.reducerPath].queries).toEqual({});
    expect(nextState[pokemonApi.reducerPath].mutations).toEqual({});
    expect(nextState[pokemonApi.reducerPath].provided).toEqual({});
    expect(nextState[pokemonApi.reducerPath].subscriptions).toEqual({});
  });
});
