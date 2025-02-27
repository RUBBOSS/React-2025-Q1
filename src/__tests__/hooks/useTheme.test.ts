import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTheme } from '../../hooks/useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('initializes with system preference', () => {
    interface MediaQueryList {
      matches: boolean;
      addEventListener: (type: string, listener: EventListener) => void;
      removeEventListener: (type: string, listener: EventListener) => void;
    }

    window.matchMedia = vi.fn().mockImplementation(
      (query: string): MediaQueryList => ({
        matches: query === '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })
    );

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBeDefined();
  });

  it('toggles theme', () => {
    const { result } = renderHook(() => useTheme());
    const initialTheme = result.current.theme;

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).not.toBe(initialTheme);
  });

  it('persists theme preference', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    const savedTheme = localStorage.getItem('theme');
    expect(savedTheme).toBe(result.current.theme);
  });
});
