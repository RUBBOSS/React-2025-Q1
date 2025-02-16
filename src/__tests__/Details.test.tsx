import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Details from '../components/Details';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams({ details: '1' }), vi.fn()],
  };
});

describe('Details', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () =>
                  Promise.resolve({
                    name: 'bulbasaur',
                    height: 7,
                    weight: 69,
                    types: [],
                    stats: [],
                    sprites: {},
                    abilities: [],
                  }),
              }),
            100
          )
        )
    );

    const renderResult = render(
      <BrowserRouter>
        <Details />
      </BrowserRouter>
    );

    await act(async () => {});

    const loader = renderResult.container.querySelector(
      '[data-testid="loader"]'
    );
    expect(loader).toBeInTheDocument();
  });

  it('displays pokemon details after successful fetch', async () => {
    const mockData = {
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      types: [{ type: { name: 'grass' } }],
      stats: [
        { base_stat: 45, stat: { name: 'hp' } },
        { base_stat: 49, stat: { name: 'attack' } },
      ],
      sprites: {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      },
      abilities: [
        { ability: { name: 'overgrow' } },
        { ability: { name: 'chlorophyll' } },
      ],
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <Details />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('grass')).toBeInTheDocument();
      expect(screen.getByText('Height: 0.7m')).toBeInTheDocument();
      expect(screen.getByText('Weight: 6.9kg')).toBeInTheDocument();
    });
  });

  it('shows error state on fetch failure', async () => {
    const mockFetchError = new Error('Failed to fetch');
    global.fetch = vi.fn().mockRejectedValue(mockFetchError);

    await act(async () => {
      render(
        <BrowserRouter>
          <Details />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      const errorElement = screen.getByTestId('error-message');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent(/failed to fetch data/i);
    });
  });
});
