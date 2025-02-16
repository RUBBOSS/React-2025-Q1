import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Pagination from '../components/Pagination';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => {
      const setSearchParams = vi.fn();
      const searchParams = new URLSearchParams();
      searchParams.set('page', '1');
      return [searchParams, setSearchParams];
    },
  };
});

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Pagination', () => {
  it('renders pagination controls', () => {
    renderWithRouter(<Pagination totalItems={45} itemsPerPage={9} />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText(/Page 1 of 5/)).toBeInTheDocument();
  });

  it('handles navigation buttons correctly', () => {
    renderWithRouter(<Pagination totalItems={45} itemsPerPage={9} />);

    const firstPage = screen.getByTestId('first-page');
    const prevPage = screen.getByTestId('prev-page');

    expect(firstPage).toBeDisabled();
    expect(prevPage).toBeDisabled();
  });

  it('shows correct number of pages', () => {
    renderWithRouter(<Pagination totalItems={45} itemsPerPage={9} />);

    expect(screen.getByText(/of 5/)).toBeInTheDocument();
  });

  it('hides pagination if only one page', () => {
    renderWithRouter(<Pagination totalItems={9} itemsPerPage={9} />);
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('renders page numbers', () => {
    renderWithRouter(<Pagination totalItems={30} itemsPerPage={10} />);

    const pageInfo = screen.getByTestId('page-info');
    expect(pageInfo).toHaveTextContent('Page 1');
    expect(pageInfo).toHaveTextContent('of 3');
  });

  it('displays current page information', () => {
    renderWithRouter(<Pagination totalItems={30} itemsPerPage={10} />);

    const pageInfo = screen.getByTestId('page-info');
    expect(pageInfo).toHaveTextContent(/Page 1/);
    expect(pageInfo).toHaveTextContent(/of 3/);
  });
});
