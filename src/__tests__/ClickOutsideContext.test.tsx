import { useContext } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ClickOutsideProvider,
  ClickOutsideContext,
} from '../context/ClickOutsideContext';

const ClickOutsideConsumer = () => {
  const context = useContext(ClickOutsideContext);
  return <div>{context ? 'Context available' : 'No context'}</div>;
};

describe('ClickOutsideContext', () => {
  it('provides context value', () => {
    render(
      <ClickOutsideProvider>
        <ClickOutsideConsumer />
      </ClickOutsideProvider>
    );
    expect(screen.getByText(/context available/i)).toBeInTheDocument();
  });
});
