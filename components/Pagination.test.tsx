import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';
vi.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/test',
    query: {},
    push: vi.fn(),
  }),
}));
describe('Pagination', () => {
  it('renders page buttons correctly', () => {
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={vi.fn()} />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    const ellipsis = screen.getAllByText('…');
    expect(ellipsis.length).toBe(1);
  });
  it('highlights current page', () => {
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={vi.fn()} />
    );
    const currentPageButton = screen.getByText('3').closest('button');
    expect(currentPageButton).toHaveClass('bg-blue-600');
    expect(currentPageButton).toHaveClass('text-white');
    const otherPageButton = screen.getByText('2').closest('button');
    expect(otherPageButton).not.toHaveClass('bg-blue-600');
  });
  it('disables first and previous buttons on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />
    );
    const firstButton = screen.getByLabelText('Go to first page');
    const prevButton = screen.getByLabelText('Previous page');
    expect(firstButton).toHaveClass('cursor-not-allowed');
    expect(prevButton).toHaveClass('cursor-not-allowed');
  });
  it('disables last and next buttons on last page', () => {
    render(
      <Pagination currentPage={10} totalPages={10} onPageChange={vi.fn()} />
    );
    const lastButton = screen.getByLabelText('Go to last page');
    const nextButton = screen.getByLabelText('Next page');
    expect(lastButton).toHaveClass('cursor-not-allowed');
    expect(nextButton).toHaveClass('cursor-not-allowed');
  });
  it('calls onPageChange when page button is clicked', () => {
    const mockOnPageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    const pageButton = screen.getByText('4').closest('button');
    if (pageButton) {
      fireEvent.click(pageButton);
    }
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });
  it('calls onPageChange with page 1 when first button is clicked', () => {
    const mockOnPageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    const firstButton = screen.getByLabelText('Go to first page');
    fireEvent.click(firstButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });
  it('calls onPageChange with last page when last button is clicked', () => {
    const mockOnPageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    const lastButton = screen.getByLabelText('Go to last page');
    fireEvent.click(lastButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(10);
  });
  it('calls onPageChange with previous page when previous button is clicked', () => {
    const mockOnPageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    const prevButton = screen.getByLabelText('Previous page');
    fireEvent.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });
  it('calls onPageChange with next page when next button is clicked', () => {
    const mockOnPageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    const nextButton = screen.getByLabelText('Next page');
    fireEvent.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });
  it('shows all pages when total pages is less than max to show', () => {
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });
});
