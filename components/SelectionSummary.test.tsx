import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectionSummary from './SelectionSummary';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Create a mock store
function createMockStore(selectedIds: number[] = []) {
  return configureStore({
    reducer: {
      selectedPokemon: (state = { ids: selectedIds, entities: {} }, action) => {
        switch (action.type) {
          case 'selectedPokemon/clearSelection':
            return {
              ...state,
              ids: []
            };
          default:
            return state;
        }
      }
    }
  });
}

describe('SelectionSummary', () => {
  it('renders with the correct count of selected Pokemon', () => {
    const store = createMockStore([1, 2, 3]);
    
    render(
      <Provider store={store}>
        <SelectionSummary />
      </Provider>
    );
    
    // The text is split across multiple elements, so check each part
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(/Pokemon selected/)).toBeInTheDocument();
  });
  
  it('renders a Clear Selection button', () => {
    const store = createMockStore([1, 2, 3]);
    
    render(
      <Provider store={store}>
        <SelectionSummary />
      </Provider>
    );
    
    // Should have a Clear Selection button
    const clearButton = screen.getByText(/Clear Selection/i);
    expect(clearButton).toBeInTheDocument();
  });
  
  it('dispatches clearSelection action when Clear Selection button is clicked', () => {
    const store = createMockStore([1, 2, 3]);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    
    render(
      <Provider store={store}>
        <SelectionSummary />
      </Provider>
    );
    
    // Should have a Clear Selection button
    const clearButton = screen.getByText(/Clear Selection/i);
    expect(clearButton).toBeInTheDocument();
    
    // Click the Clear button
    fireEvent.click(clearButton);
    
    // Should dispatch the clear action with the correct type
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
      type: 'selectedPokemon/clearSelection'
    }));
  });
  
  it('applies correct styling to the summary container', () => {
    const store = createMockStore([1, 2, 3]);
    
    const { container } = render(
      <Provider store={store}>
        <SelectionSummary />
      </Provider>
    );
    
    // Check the actual classes that are applied
    const summaryElement = container.firstChild as HTMLElement;
    expect(summaryElement).not.toBeNull();
    expect(summaryElement?.className).toContain('bg-blue-50');
    expect(summaryElement?.className).toContain('p-3');
    expect(summaryElement?.className).toContain('rounded-lg');
  });
  
  it('shows correct message with no Pokemon selected', () => {
    const store = createMockStore([]);
    
    const { container, debug } = render(
      <Provider store={store}>
        <SelectionSummary />
      </Provider>
    );
    
    debug();

    // Check that the component renders something
    expect(container).not.toBeEmptyDOMElement();
    
    // Look for either '0' or 'No' in the text content
    const summaryText = container.textContent;
    expect(summaryText).toMatch(/0|no/i);
    
    // The clear button should be present but disabled
    const clearButton = screen.getByRole('button', { name: /clear selection/i });
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toBeDisabled();

    // Check for basic styling
    const wrapperElement = container.querySelector('[class*="bg-blue-"]');
    expect(wrapperElement).toBeInTheDocument();
  });
  
  it('shows correct message with one Pokemon selected', () => {
    const store = createMockStore([42]);
    
    render(
      <Provider store={store}>
        <SelectionSummary />
      </Provider>
    );
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/Pokemon selected/)).toBeInTheDocument();
  });
  
  it('has the correct text content in the summary message', () => {
    const store = createMockStore([1, 2, 3, 4, 5]);
    
    render(
      <Provider store={store}>
        <SelectionSummary />
      </Provider>
    );
    
    // Check the container instead of just the text element
    const summaryContainer = screen.getByText(/Pokemon selected/i).closest('div');
    expect(summaryContainer).toBeInTheDocument();
    expect(summaryContainer?.textContent).toContain('5');
    expect(summaryContainer?.textContent).toContain('Pokemon selected');
    
    // Alternative approach using regular expressions that match parts of text
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });
  
  it('applies correct styling to the Clear button', () => {
    const store = createMockStore([1, 2, 3]);
    
    render(
      <Provider store={store}>
        <SelectionSummary />
      </Provider>
    );
    
    // Clear button should have blue styling
    const clearButton = screen.getByText(/Clear Selection/i);
    expect(clearButton).toHaveClass('bg-blue-600');
    expect(clearButton).toHaveClass('text-white');
  });
  
  it('displays the Pokemon count with proper styling', () => {
    const store = createMockStore([1, 2, 3]);
    
    render(
      <Provider store={store}>
        <SelectionSummary />
      </Provider>
    );
    
    // The count should be styled differently
    const countElement = screen.getByText('3');
    expect(countElement).toHaveClass('font-medium');
    expect(countElement).toHaveClass('text-blue-800');
  });
});
