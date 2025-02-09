import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Pagination from '../components/Pagination';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams({ page: '1' }), vi.fn()],
  };
});

describe('Pagination', () => {
  it('renders pagination controls', () => {
    render(
      <BrowserRouter>
        <Pagination totalItems={20} itemsPerPage={9} />
      </BrowserRouter>
    );

    const pageText = screen.getByText((_content, element) => {
      return element?.textContent === 'Page 1 of 3';
    });
    expect(pageText).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Last' })).toBeInTheDocument();
  });

  it('shows correct number of pages', () => {
    render(
      <BrowserRouter>
        <Pagination totalItems={27} itemsPerPage={9} />
      </BrowserRouter>
    );

    const pageText = screen.getByText((_content, element) => {
      return element?.textContent === 'Page 1 of 3';
    });
    expect(pageText).toBeInTheDocument();
  });
});
