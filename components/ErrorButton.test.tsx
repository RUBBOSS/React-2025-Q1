import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorButton from './ErrorButton';
describe('ErrorButton', () => {
  it('renders correctly', () => {
    render(<ErrorButton />);
    expect(screen.getByText('Throw Test Error')).toBeInTheDocument();
  });
  it('throws an error when clicked', () => {
    const handleClick = vi.fn().mockImplementation(() => {
      throw new Error('This is a test error from the Error Button');
    });
    vi.spyOn(React, 'createElement').mockImplementationOnce(
      (type, props, ...children) => {
        if (type === 'button') {
          return {
            type,
            props: {
              ...props,
              onClick: handleClick,
            },
            key: null,
            ref: null,
            $$typeof: Symbol.for('react.element'),
            _owner: null,
          };
        }
        return React.createElement(type, props, ...children);
      }
    );
    render(<ErrorButton />);
    expect(handleClick).not.toHaveBeenCalled();
    expect(() => handleClick()).toThrow(
      'This is a test error from the Error Button'
    );
  });
});
