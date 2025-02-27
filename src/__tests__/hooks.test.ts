import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useOnClickOutside from '../hooks/useOnClickOutside';

describe('useOnClickOutside', () => {
  it('should call handler when clicking outside', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    renderHook(() => useOnClickOutside(ref, handler));

    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    document.dispatchEvent(event);
    expect(handler).toHaveBeenCalledTimes(1);
    document.body.removeChild(ref.current);
  });

  it('should not call handler when clicking inside', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    renderHook(() => useOnClickOutside(ref, handler));

    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    ref.current.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(ref.current);
  });
});
