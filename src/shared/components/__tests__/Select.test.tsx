import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '../Select';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
];

describe('Select', () => {
  it('renders with label', () => {
    render(<Select label="Category" options={options} />);
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Select label="Category" options={options} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('generates id from label', () => {
    render(<Select label="My Select" options={options} />);
    expect(screen.getByLabelText('My Select').id).toBe('my-select');
  });

  it('uses provided id', () => {
    render(<Select label="Type" id="doc-type" options={options} />);
    expect(screen.getByLabelText('Type').id).toBe('doc-type');
  });

  it('calls onChange when selecting an option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select label="Pick" options={options} onChange={onChange} />);

    await user.selectOptions(screen.getByLabelText('Pick'), 'b');
    expect(onChange).toHaveBeenCalled();
  });

  it('respects value prop', () => {
    render(<Select label="Pick" options={options} value="c" onChange={() => {}} />);
    expect((screen.getByLabelText('Pick') as HTMLSelectElement).value).toBe('c');
  });
});
