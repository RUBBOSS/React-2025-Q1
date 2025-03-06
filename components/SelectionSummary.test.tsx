import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectionSummary from './SelectionSummary';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
vi.mock('../redux/hooks', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(),
}));
vi.mock('../redux/slices/selectedPokemonSlice', () => ({
  selectSelectedPokemonIds: vi.fn(),
  clearAllSelections: vi.fn(),
  clearSelection: vi.fn(() => ({ type: 'selectedPokemon/clearSelection' })),
}));
describe('SelectionSummary', () => {
  it('renders nothing when no Pokemon are selected', () => {
    vi.mocked(useAppSelector).mockReturnValue([]);
    const { container } = render(<SelectionSummary />);
    expect(container.firstChild).toBeNull();
  });
  it('shows the number of selected Pokemon', () => {
    vi.mocked(useAppSelector).mockReturnValue([1, 2, 3]);
    render(<SelectionSummary />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Pokemon selected')).toBeInTheDocument();
  });
  it('dispatches an action when clear button is clicked', () => {
    const mockDispatch = vi.fn();
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);
    vi.mocked(useAppSelector).mockReturnValue([1, 2, 3]);
    render(<SelectionSummary />);
    const clearButton = screen.getByText('Clear Selection');
    fireEvent.click(clearButton);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
