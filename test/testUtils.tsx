import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ReactNode } from 'react';
import paginationReducer from '../redux/slices/paginationSlice';
import { selectedPokemonSlice } from '../redux/slices/selectedPokemonSlice';

export const mockStore = configureStore({
  reducer: {
    pagination: paginationReducer,
    selectedPokemon: selectedPokemonSlice.reducer,
  },
  preloadedState: {
    pagination: {
      currentPage: 1,
      itemsPerPage: 9,
      searchTerm: ''
    },
    selectedPokemon: {
      ids: [],
      items: {},
    }
  }
});

const createMockRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
  asPath: '/',
  pathname: '/',
  route: '/',
  basePath: '',
  isLocaleDomain: false
});

export const mockRouter = createMockRouter();

export const mockSearchParams = new URLSearchParams();
mockSearchParams.get = vi.fn().mockImplementation((param) => {
  if (param === 'page') return '1';
  if (param === 'search') return '';
  return null;
});
mockSearchParams.toString = vi.fn().mockImplementation(() => '');

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/',
  createNextRouter: () => mockRouter
}));

export const renderWithProviders = (ui: React.ReactElement) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={mockStore}>{children}</Provider>
  );
  return render(ui, { wrapper: Wrapper });
};
