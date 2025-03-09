/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const plugins = [react()] as unknown as any[];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
    include: ['components/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: [
      'node_modules',
      '.next',
      'coverage/**',
      'dist/**',
      'pages/**',
      'redux/**',
      'services/**',
      'hooks/**',
      'context/**',
      'styles/**',
      'types/**',
      'utils/**',
      'lib/**',
      '__mocks__/**',
      'components/HomePage.tsx'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'components/*.tsx',
        'components/**/*.tsx'
      ],
      exclude: [
        'node_modules/**',
        'coverage/**',
        '.next/**',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/*.config.js',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'components/HomePage.tsx'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      },
      enabled: true,
      all: true,
      clean: true
    }
  }
});