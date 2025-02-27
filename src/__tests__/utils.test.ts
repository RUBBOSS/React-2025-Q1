import { describe, it, expect } from 'vitest';
import { extractIdFromUrl, formatNumber, capitalize } from '../utils/utils';

describe('Utils', () => {
  describe('extractIdFromUrl', () => {
    it('should extract ID from URL', () => {
      const result = extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/');
      expect(result).toBe('25');
    });

    it('should handle invalid URLs', () => {
      const result = extractIdFromUrl('invalid-url');
      expect(result).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers correctly', () => {
      expect(formatNumber(1)).toBe('001');
      expect(formatNumber(25)).toBe('025');
      expect(formatNumber(999)).toBe('999');
    });
  });

  describe('capitalize', () => {
    it('should capitalize strings', () => {
      expect(capitalize('pikachu')).toBe('Pikachu');
      expect(capitalize('')).toBe('');
    });
  });
});
