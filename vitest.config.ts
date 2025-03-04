/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['components/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: [
      'node_modules',
      '.next',
      'src/**',
      'pages/**',
      'styles/**',
      'public/**',
      'lib/**',
      'context/**',
      'redux/**',
      'types/**'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['components/**/*.{tsx,ts}'],
      exclude: [
        'components/**/*.{test,spec}.?(c|m)[jt]s?(x)',
        'node_modules',
        '.next',
        'src/**',
        'pages/**',
        'styles/**',
        'public/**',
        'lib/**',
        'context/**',
        'redux/**',
        'types/**'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
});
