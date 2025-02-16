import { describe, it, expect } from 'vitest';
import reducer, {
  addItem,
  removeItem,
  clearItems,
} from '../features/selectedItemsSlice';

describe('selectedItemsSlice', () => {
  const initialState = {
    items: {},
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addItem', () => {
    const item = { name: 'pikachu', url: 'test-url', description: 'test' };
    const nextState = reducer(initialState, addItem(item));
    expect(nextState.items).toHaveProperty('pikachu');
  });

  it('should handle removeItem', () => {
    const state = {
      items: {
        pikachu: { name: 'pikachu', url: 'test-url', description: 'test' },
      },
    };
    const nextState = reducer(state, removeItem('pikachu'));
    expect(nextState.items).not.toHaveProperty('pikachu');
  });

  it('should handle clearItems', () => {
    const state = {
      items: {
        pikachu: { name: 'pikachu', url: 'test-url', description: 'test' },
      },
    };
    const nextState = reducer(state, clearItems());
    expect(nextState.items).toEqual({});
  });
});
