import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextArea from '../TextArea';

describe('TextArea', () => {
  it('renders with label', () => {
    render(<TextArea label="Description" />);
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('generates id from label', () => {
    render(<TextArea label="Long Description" />);
    expect(screen.getByLabelText('Long Description').id).toBe('long-description');
  });

  it('uses provided id', () => {
    render(<TextArea label="Notes" id="my-notes" />);
    expect(screen.getByLabelText('Notes').id).toBe('my-notes');
  });

  it('renders as a textarea element', () => {
    render(<TextArea label="Content" />);
    expect(screen.getByLabelText('Content').tagName).toBe('TEXTAREA');
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextArea label="Notes" onChange={onChange} />);

    await user.type(screen.getByLabelText('Notes'), 'some text');
    expect(onChange).toHaveBeenCalled();
  });

  it('passes through placeholder and rows', () => {
    render(<TextArea label="Bio" placeholder="Tell us about yourself" rows={5} />);
    const textarea = screen.getByLabelText('Bio');
    expect(textarea).toHaveAttribute('placeholder', 'Tell us about yourself');
    expect(textarea).toHaveAttribute('rows', '5');
  });
});
