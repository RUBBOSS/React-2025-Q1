import { describe, it, expect } from 'vitest';
import { extractIdFromUrl, formatNumber, capitalize } from '../../utils/utils';

describe('Utils Extra', () => {
  it('returns empty string for extractIdFromUrl when given an empty URL', () => {
    expect(extractIdFromUrl('')).toBe('');
  });

  it('formats negative numbers correctly', () => {
    expect(formatNumber(-5)).toBe('0-5');
  });

  it('does not change already capitalized string in capitalize', () => {
    expect(capitalize('Pikachu')).toBe('Pikachu');
  });
});
