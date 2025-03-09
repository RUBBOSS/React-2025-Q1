import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';
vi.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: {},
    asPath: '',
    push: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn()
    },
    beforePopState: vi.fn(() => null),
    prefetch: vi.fn(() => null)
  }),
}));
interface ImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
}
vi.mock('next/image', () => ({
    default: (props: ImageProps) => {
        return React.createElement('img', {
            src: props.src,
            alt: props.alt,
            width: props.width,
            height: props.height,
            className: props.className,
            loading: 'lazy'
        });
    },
    __esModule: true,
}));
