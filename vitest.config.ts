import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    server: {
      deps: {
        inline: ['@testing-library/jest-dom'],
      },
    },
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.{test,spec}.?(c|m)[jt]s?(x)',
        'eslint.config.js',
        'tailwind.config.js',
        'vite.config.ts',
        'vitest.config.ts',
        'src/vite-env.d.ts',
        'src/__tests__/**',
        'src/__tests__/testData.ts',
        'src/types/**',
        'src/utils/index.ts',
        'src/main.tsx',
        'src/hooks/useDownloadFile.tsx',
        'src/hooks/useRestoreSearchQuery.ts',
        'src/api/pokeapi.ts',
        'src/context/searchTypes.ts',
        'src/components/Flyout.tsx',
        'src/components/LoadingIndicator.tsx',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
