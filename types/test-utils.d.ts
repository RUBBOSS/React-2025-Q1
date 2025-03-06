import '@testing-library/jest-dom';
declare global {
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): void;
      toHaveClass(className: string): void;
      toHaveAttribute(attribute: string, value?: string): void;
      toBeDisabled(): void;
      toBeEnabled(): void;
      toBeVisible(): void;
      toHaveValue(value: string | number | boolean): void;
      toBeChecked(): void;
    }
  }
}
