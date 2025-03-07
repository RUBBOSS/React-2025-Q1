import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  {
    ignores: [
      'node_modules/**', 
      '.next/**', 
      'dist/**', 
      '*.config.*',
      'coverage/**'
    ]
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: true,
        document: true,
        console: true,
        module: true,
        require: true,
        process: true,
        __dirname: true,
        global: true
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error'
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@next/next': nextPlugin
    },
    settings: {
      next: { 
        rootDir: '.',
        pagesDir: ['pages']
      }
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...nextPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
];