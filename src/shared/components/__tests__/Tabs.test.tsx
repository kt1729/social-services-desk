import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tabs from '../Tabs';

const tabs = [
  { key: 'resources', label: 'Resources' },
  { key: 'guests', label: 'Guests' },
  { key: 'documents', label: 'Documents' },
];

describe('Tabs', () => {
  it('renders all tab labels', () => {
    render(<Tabs tabs={tabs} activeKey="resources" onChange={() => {}} />);
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Guests')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
  });

  it('highlights the active tab', () => {
    render(<Tabs tabs={tabs} activeKey="guests" onChange={() => {}} />);
    const guestsTab = screen.getByText('Guests');
    expect(guestsTab.className).toContain('border-blue-600');
    expect(guestsTab.className).toContain('text-blue-600');
  });

  it('does not highlight inactive tabs', () => {
    render(<Tabs tabs={tabs} activeKey="guests" onChange={() => {}} />);
    const resourcesTab = screen.getByText('Resources');
    expect(resourcesTab.className).not.toContain('border-blue-600');
    expect(resourcesTab.className).toContain('text-gray-500');
  });

  it('calls onChange with tab key when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs tabs={tabs} activeKey="resources" onChange={onChange} />);

    await user.click(screen.getByText('Documents'));
    expect(onChange).toHaveBeenCalledWith('documents');
  });

  it('renders all tabs as buttons', () => {
    render(<Tabs tabs={tabs} activeKey="resources" onChange={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });
});
