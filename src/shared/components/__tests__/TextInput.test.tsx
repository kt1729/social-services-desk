import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextInput from '../TextInput';

describe('TextInput', () => {
  it('renders with label', () => {
    render(<TextInput label="First Name" />);
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
  });

  it('generates id from label when not provided', () => {
    render(<TextInput label="Phone Number" />);
    const input = screen.getByLabelText('Phone Number');
    expect(input.id).toBe('phone-number');
  });

  it('uses provided id', () => {
    render(<TextInput label="Email" id="custom-id" />);
    const input = screen.getByLabelText('Email');
    expect(input.id).toBe('custom-id');
  });

  it('passes through HTML input attributes', () => {
    render(<TextInput label="Name" placeholder="Enter name" required />);
    const input = screen.getByLabelText('Name');
    expect(input).toHaveAttribute('placeholder', 'Enter name');
    expect(input).toBeRequired();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextInput label="Name" onChange={onChange} />);

    await user.type(screen.getByLabelText('Name'), 'hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<TextInput label="Test" className="custom-class" />);
    const input = screen.getByLabelText('Test');
    expect(input.className).toContain('custom-class');
  });
});
