import { describe, it, expect } from 'vitest';
import { API_BASE_URL } from '../../config';

describe('Config', () => {
  it('should have a valid API_BASE_URL', () => {
    expect(API_BASE_URL).toBeDefined();
    expect(typeof API_BASE_URL).toBe('string');
    expect(API_BASE_URL.startsWith('http')).toBe(true);
  });
});
