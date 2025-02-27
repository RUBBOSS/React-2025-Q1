import { describe, it, expect } from 'vitest';
import { extractIdFromUrl, formatNumber, capitalize } from '../../utils/utils';

describe('Utils', () => {
  it('extracts id from URL correctly', () => {
    expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(
      '25'
    );
    expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/7')).toBe('7');
    expect(extractIdFromUrl('invalid-url')).toBe('');
  });

  it('formats number with leading zeros', () => {
    expect(formatNumber(5)).toBe('005');
    expect(formatNumber(123)).toBe('123');
  });

  it('capitalizes a string', () => {
    expect(capitalize('pikachu')).toBe('Pikachu');
    expect(capitalize('')).toBe('');
  });
});
