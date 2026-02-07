import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagInput from '../TagInput';

describe('TagInput', () => {
  it('renders existing tags', () => {
    render(<TagInput value={['food', 'shelter']} onChange={() => {}} />);
    expect(screen.getByText('food')).toBeInTheDocument();
    expect(screen.getByText('shelter')).toBeInTheDocument();
  });

  it('shows placeholder when no tags exist', () => {
    render(<TagInput value={[]} onChange={() => {}} placeholder="Add tag..." />);
    expect(screen.getByPlaceholderText('Add tag...')).toBeInTheDocument();
  });

  it('hides placeholder when tags exist', () => {
    render(<TagInput value={['food']} onChange={() => {}} placeholder="Add tag..." />);
    expect(screen.queryByPlaceholderText('Add tag...')).not.toBeInTheDocument();
  });

  it('adds a tag on Enter key', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={[]} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'newtag{Enter}');

    expect(onChange).toHaveBeenCalledWith(['newtag']);
  });

  it('adds a tag on comma key', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={[]} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'newtag,');

    expect(onChange).toHaveBeenCalledWith(['newtag']);
  });

  it('does not add duplicate tags', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={['existing']} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'existing{Enter}');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('trims and lowercases tags', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={[]} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, '  UPPER  {Enter}');

    expect(onChange).toHaveBeenCalledWith(['upper']);
  });

  it('removes a tag when clicking the remove button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={['food', 'shelter']} onChange={onChange} />);

    const removeButtons = screen.getAllByRole('button');
    await user.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalledWith(['shelter']);
  });

  it('removes last tag on Backspace when input is empty', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={['food', 'shelter']} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.keyboard('{Backspace}');

    expect(onChange).toHaveBeenCalledWith(['food']);
  });

  it('adds tag on blur', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={[]} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'blurtag');
    await user.tab();

    expect(onChange).toHaveBeenCalledWith(['blurtag']);
  });
});
