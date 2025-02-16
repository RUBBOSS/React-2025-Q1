import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchInput from '../../components/SearchInput';

describe('SearchInput', () => {
  it('renders input element', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls onChange handler', () => {
    const handleChange = vi.fn();
    render(<SearchInput value="" onChange={handleChange} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'test' },
    });

    expect(handleChange).toHaveBeenCalledWith('test');
  });

  it('displays value prop', () => {
    render(<SearchInput value="test value" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('test value');
  });
});
