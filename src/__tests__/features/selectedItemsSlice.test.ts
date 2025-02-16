import { describe, it, expect } from 'vitest';
import reducer, {
  toggleItem,
  clearItems,
} from '../../features/selectedItemsSlice';

describe('selectedItemsSlice', () => {
  const initialState = { items: {} };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle toggleItem', () => {
    const item = { name: 'bulbasaur', url: 'test-url', description: 'test' };
    let state = reducer(initialState, toggleItem(item));
    expect(state.items[item.name]).toEqual(item);

    state = reducer(state, toggleItem(item));
    expect(state.items[item.name]).toBeUndefined();
  });

  it('should handle clearItems', () => {
    const stateWithItems = {
      items: {
        bulbasaur: { name: 'bulbasaur', url: 'test-url', description: 'test' },
      },
    };
    const state = reducer(stateWithItems, clearItems());
    expect(Object.keys(state.items)).toHaveLength(0);
  });
});
