import { describe, it, expect } from 'vitest';
import { API_BASE_URL, ITEMS_PER_PAGE } from '../config';

describe('Config', () => {
  it('should have correct API base URL', () => {
    expect(API_BASE_URL).toBe('https://pokeapi.co/api/v2');
  });

  it('should have correct items per page', () => {
    expect(ITEMS_PER_PAGE).toBe(9);
  });
});
