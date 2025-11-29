// src/components/Button/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button component', () => {
  it('renders the button with the correct text', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByText(/Click me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it('applies the primary variant class by default', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByText(/Click me/i);
    expect(buttonElement).toHaveClass('bg-blue-500');
  });

  it('applies the secondary variant class when specified', () => {
    render(<Button variant="secondary">Click me</Button>);
    const buttonElement = screen.getByText(/Click me/i);
    expect(buttonElement).toHaveClass('bg-gray-500');
  });

  it('applies the danger variant class when specified', () => {
    render(<Button variant="danger">Click me</Button>);
    const buttonElement = screen.getByText(/Click me/i);
    expect(buttonElement).toHaveClass('bg-red-500');
  });
});
