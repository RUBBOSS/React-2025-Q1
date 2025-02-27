import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useClickOutside } from '../../hooks/useClickOutside';

describe('useClickOutside', () => {
  it('calls handler when clicking outside', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    renderHook(() => useClickOutside(ref, handler));

    // Create and dispatch mousedown event
    const mouseEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    document.body.dispatchEvent(mouseEvent);
    expect(handler).toHaveBeenCalled();

    ref.current.dispatchEvent(mouseEvent);
    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(ref.current);
  });
});
