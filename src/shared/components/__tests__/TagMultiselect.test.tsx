import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Timestamp } from 'firebase/firestore';
import TagMultiselect from '../TagMultiselect';
import type { Tag } from '../../types';

const now = Timestamp.fromDate(new Date(0));

const TAGS: Tag[] = [
  { id: 't1', label: 'Emergency Housing', slug: 'emergency-housing', createdAt: now },
  { id: 't2', label: 'Food Support', slug: 'food-support', createdAt: now },
  { id: 't3', label: 'Overnight', slug: 'overnight', createdAt: now },
];

function openDropdown(container: HTMLElement) {
  // The trigger is the first (outermost) button in the component
  return container.querySelector('button') as HTMLElement;
}

describe('TagMultiselect', () => {
  it('shows placeholder when value is empty', () => {
    render(
      <TagMultiselect value={[]} onChange={() => {}} tags={TAGS} placeholder="Select tags…" />,
    );
    expect(screen.getByText('Select tags…')).toBeInTheDocument();
  });

  it('shows pills for selected tag IDs', () => {
    render(<TagMultiselect value={['t1']} onChange={() => {}} tags={TAGS} />);
    expect(screen.getByText('Emergency Housing')).toBeInTheDocument();
  });

  it('skips orphaned tag IDs silently — shows placeholder, no error', () => {
    expect(() =>
      render(<TagMultiselect value={['unknown-id']} onChange={() => {}} tags={TAGS} />),
    ).not.toThrow();
    expect(screen.getByText('Select tags…')).toBeInTheDocument();
  });

  it('selecting a tag calls onChange with ID appended', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <TagMultiselect value={[]} onChange={onChange} tags={TAGS} />,
    );

    await user.click(openDropdown(container));
    expect(screen.getByPlaceholderText('Search tags…')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Emergency Housing' }));
    expect(onChange).toHaveBeenCalledWith(['t1']);
  });

  it('deselecting a tag calls onChange with ID removed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <TagMultiselect value={['t1']} onChange={onChange} tags={TAGS} />,
    );

    await user.click(openDropdown(container));
    // Selected tag button in dropdown has '✓' prepended
    await user.click(screen.getByRole('button', { name: /✓.*Emergency Housing/i }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('removing a pill via × calls onChange with ID removed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagMultiselect value={['t1', 't2']} onChange={onChange} tags={TAGS} />);

    await user.click(screen.getByRole('button', { name: /remove emergency housing/i }));
    expect(onChange).toHaveBeenCalledWith(['t2']);
  });

  it('search filters tags case-insensitively', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <TagMultiselect value={[]} onChange={() => {}} tags={TAGS} />,
    );

    await user.click(openDropdown(container));
    await user.type(screen.getByPlaceholderText('Search tags…'), 'HOUS');

    expect(screen.getByRole('button', { name: 'Emergency Housing' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Food Support' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Overnight' })).not.toBeInTheDocument();
  });

  it('search with no matches shows "No matching tags."', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <TagMultiselect value={[]} onChange={() => {}} tags={TAGS} />,
    );

    await user.click(openDropdown(container));
    await user.type(screen.getByPlaceholderText('Search tags…'), 'zzznomatch');

    expect(screen.getByText('No matching tags.')).toBeInTheDocument();
  });

  it('tagsLoading=true shows "Loading…" in dropdown', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <TagMultiselect value={[]} onChange={() => {}} tags={[]} tagsLoading={true} />,
    );

    await user.click(openDropdown(container));
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('empty tags list shows "No tags yet." message', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <TagMultiselect value={[]} onChange={() => {}} tags={[]} tagsLoading={false} />,
    );

    await user.click(openDropdown(container));
    expect(screen.getByText(/No tags yet/)).toBeInTheDocument();
  });
});
