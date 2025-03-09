import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/testUtils';
import Pagination from './Pagination';
import '../test/testUtils';

// Mock the Next.js router and searchParams
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    toString: () => '',
    get: () => null,
  }),
}));

describe('Pagination', () => {
  it('renders page buttons correctly', () => {
    renderWithProviders(
      <Pagination currentPage={3} totalPages={10} onPageChange={vi.fn()} />
    );
    
    // Check that numeric buttons exist
    expect(screen.getByText('3')).toBeInTheDocument();
    
    // Get navigation buttons by their aria-label
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
  });

  it('calls onPageChange when page button is clicked', () => {
    const mockOnPageChange = vi.fn();
    
    renderWithProviders(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    
    // Find a button by its aria-label
    const pageButton = screen.getByLabelText('Go to page 4');
    fireEvent.click(pageButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange with page 1 when first button is clicked', () => {
    const mockOnPageChange = vi.fn();
    renderWithProviders(
      <Pagination currentPage={3} totalPages={10} onPageChange={mockOnPageChange} />
    );
    const firstButton = screen.getByLabelText('Go to first page');
    fireEvent.click(firstButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange with last page when last button is clicked', () => {
    const mockOnPageChange = vi.fn();
    renderWithProviders(
      <Pagination currentPage={3} totalPages={10} onPageChange={mockOnPageChange} />
    );
    const lastButton = screen.getByLabelText('Go to last page');
    fireEvent.click(lastButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(10);
  });

  it('shows all page numbers when total pages is less than or equal to maxPagesToShow', () => {
    renderWithProviders(
      <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />
    );
    
    // Should show 5 page numbers without ellipsis
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  it('shows ellipsis when current page is in the middle of a large range', () => {
    renderWithProviders(
      <Pagination currentPage={50} totalPages={100} onPageChange={vi.fn()} />
    );
    
    // Should show ellipsis for both start and end ranges
    const ellipsis = screen.getAllByText('...');
    expect(ellipsis).toHaveLength(2);
    
    // Should show first page, last page, and pages around current
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('49')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('51')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('adjusts page number display when current page is near the start', () => {
    renderWithProviders(
      <Pagination currentPage={2} totalPages={20} onPageChange={vi.fn()} />
    );
    
    // Should show first 4 pages without starting ellipsis
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    
    // Should have only one ellipsis (at the end)
    const ellipsis = screen.getAllByText('...');
    expect(ellipsis).toHaveLength(1);
    
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('adjusts page number display when current page is near the end', () => {
    renderWithProviders(
      <Pagination currentPage={19} totalPages={20} onPageChange={vi.fn()} />
    );
    
    // Should show last 4 pages without ending ellipsis
    expect(screen.getByText('17')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('19')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    
    // Should have only one ellipsis (at the start)
    const ellipsis = screen.getAllByText('...');
    expect(ellipsis).toHaveLength(1);
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('disables first and previous buttons when on first page', () => {
    renderWithProviders(
      <Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />
    );
    
    const firstButton = screen.getByLabelText('Go to first page');
    const prevButton = screen.getByLabelText('Go to previous page');
    
    expect(firstButton).toHaveAttribute('disabled');
    expect(prevButton).toHaveAttribute('disabled');
    expect(firstButton).toHaveClass('cursor-not-allowed');
    expect(prevButton).toHaveClass('cursor-not-allowed');
  });

  it('disables next and last buttons when on last page', () => {
    renderWithProviders(
      <Pagination currentPage={10} totalPages={10} onPageChange={vi.fn()} />
    );
    
    const nextButton = screen.getByLabelText('Go to next page');
    const lastButton = screen.getByLabelText('Go to last page');
    
    expect(nextButton).toHaveAttribute('disabled');
    expect(lastButton).toHaveAttribute('disabled');
    expect(nextButton).toHaveClass('cursor-not-allowed');
    expect(lastButton).toHaveClass('cursor-not-allowed');
  });

  it('does not call onPageChange when clicking on the current page button', () => {
    const mockOnPageChange = vi.fn();
    renderWithProviders(
      <Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
    );
    
    const currentPageButton = screen.getByText('5');
    fireEvent.click(currentPageButton);
    
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('does not call onPageChange when clicking on disabled buttons', () => {
    const mockOnPageChange = vi.fn();
    renderWithProviders(
      <Pagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} />
    );
    
    const firstButton = screen.getByLabelText('Go to first page');
    const prevButton = screen.getByLabelText('Go to previous page');
    
    fireEvent.click(firstButton);
    fireEvent.click(prevButton);
    
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('calls onPageChange when clicking on previous page button', () => {
    const mockOnPageChange = vi.fn();
    renderWithProviders(
      <Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
    );
    
    const prevButton = screen.getByLabelText('Go to previous page');
    fireEvent.click(prevButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange when clicking on next page button', () => {
    const mockOnPageChange = vi.fn();
    renderWithProviders(
      <Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
    );
    
    const nextButton = screen.getByLabelText('Go to next page');
    fireEvent.click(nextButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(6);
  });
});
