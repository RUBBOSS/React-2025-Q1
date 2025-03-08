import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectionFlyout from './SelectionFlyout';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  selectSelectedPokemonIds,
  selectSelectedPokemonItems,
  clearAllSelections,
} from '../redux/slices/selectedPokemonSlice';

// Mock Redux hooks
vi.mock('../redux/hooks', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(),
}));

// Mock Redux actions
vi.mock('../redux/slices/selectedPokemonSlice', () => ({
  selectSelectedPokemonIds: vi.fn(),
  selectSelectedPokemonItems: vi.fn(),
  clearAllSelections: vi.fn(),
}));

describe('SelectionFlyout', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);
    vi.mocked(clearAllSelections).mockReturnValue({
      type: 'selectedPokemon/clearAllSelections',
      payload: undefined,
    });
  });

  it('renders nothing when no Pokemon are selected', () => {
    vi.mocked(useAppSelector).mockImplementation(selector => {
      if (selector === selectSelectedPokemonIds) return [];
      return {};
    });

    const { container } = render(<SelectionFlyout />);
    expect(container.firstChild).toBeNull();
  });

  it('renders buttons when Pokemon are selected', () => {
    vi.mocked(useAppSelector).mockImplementation(selector => {
      if (selector === selectSelectedPokemonIds) return [1, 2];
      if (selector === selectSelectedPokemonItems)
        return {
          1: { id: 1, name: 'bulbasaur' },
          2: { id: 2, name: 'ivysaur' },
        };
      return {};
    });

    render(<SelectionFlyout />);
    expect(screen.getByAltText('Selected Pokémon')).toBeInTheDocument();
    expect(screen.getByAltText('Remove all items')).toBeInTheDocument();
    expect(screen.getByAltText('Download CSV')).toBeInTheDocument();
  });

  it('shows the correct number of selected Pokemon', () => {
    vi.mocked(useAppSelector).mockImplementation(selector => {
      if (selector === selectSelectedPokemonIds) return [1, 2];
      return {};
    });

    render(<SelectionFlyout />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls clearAllSelections when remove button is clicked', () => {
    vi.mocked(useAppSelector).mockImplementation(selector => {
      if (selector === selectSelectedPokemonIds) return [1, 2];
      return {};
    });

    render(<SelectionFlyout />);
    const removeButton = screen
      .getByAltText('Remove all items')
      .closest('button');
    if (removeButton) {
      fireEvent.click(removeButton);
    }

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'selectedPokemon/clearAllSelections',
      payload: undefined,
    });
  });

  it('initiates download when download button is clicked', () => {
    // Create mock anchor element outside the document.createElement mock
    const mockAnchor = document.createElement('a');
    mockAnchor.href = '';
    mockAnchor.download = '';
    const mockClick = vi.fn();
    Object.defineProperty(mockAnchor, 'click', {
      value: mockClick,
      writable: true,
    });

    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:url');
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = mockCreateObjectURL;
    URL.revokeObjectURL = vi.fn();

    const originalCreateElement = document.createElement;
    document.createElement = vi.fn().mockImplementation(tag => {
      if (tag === 'a') return mockAnchor;
      return originalCreateElement.call(document, tag);
    });

    vi.mocked(useAppSelector).mockImplementation(selector => {
      if (selector === selectSelectedPokemonIds) return [1, 2];
      if (selector === selectSelectedPokemonItems)
        return {
          1: {
            id: 1,
            name: 'bulbasaur',
            types: [{ type: { name: 'grass' } }],
            height: 7,
            weight: 69,
            officialArtwork: 'https://example.com/1.png',
            image: 'https://example.com/1-small.png',
          },
          2: {
            id: 2,
            name: 'ivysaur',
            types: [{ type: { name: 'grass' } }],
            height: 10,
            weight: 130,
            officialArtwork: 'https://example.com/2.png',
            image: 'https://example.com/2-small.png',
          },
        };
      return {};
    });

    render(<SelectionFlyout />);
    const downloadButton = screen
      .getByAltText('Download CSV')
      .closest('button');
    if (downloadButton) {
      fireEvent.click(downloadButton);
    }

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();

    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    document.createElement = originalCreateElement;
  });
});
