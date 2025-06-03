import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('should render a primary button', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <Button onClick={onClick}>Primary Button</Button>
    );
    const button = getByText('Primary Button');
    expect(button).toBeInTheDocument();
  });

  it('should render a disabled button', () => {
    const onClick = jest.fn();
    const { getByRole } = render(
      <Button onClick={onClick} disabled>
        Disabled Button
      </Button>
    );
    const button = getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should handle keyboard navigation', () => {
    const onClick = jest.fn();
    const { getByRole } = render(
      <Button onClick={onClick}>Keyboard Test</Button>
    );
    const button = getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(onClick).toHaveBeenCalled();
  });

  it('should render an outline variant', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <Button variant="outline" onClick={onClick}>
        Outline Button
      </Button>
    );
    const button = getByText('Outline Button');
    expect(button).toHaveStyle({ color: '#94a3b8' });
  });

  it('should render a small size button', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <Button size="small" onClick={onClick}>
        Small Button
      </Button>
    );
    const button = getByText('Small Button');
    expect(button).toHaveStyle({ padding: '0.375rem 0.75rem' });
  });
});