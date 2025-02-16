import { describe, it, expect } from 'vitest';
import { formatNumber, capitalize } from '../../utils/format';

describe('Format Utils', () => {
  describe('formatNumber', () => {
    it('formats numbers correctly', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000.123)).toBe('1,000.12');
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('capitalize', () => {
    it('capitalizes strings', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('')).toBe('');
      expect(capitalize('a')).toBe('A');
    });
  });
});
