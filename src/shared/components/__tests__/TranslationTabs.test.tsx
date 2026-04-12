import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TranslationTabs from '../TranslationTabs';

describe('TranslationTabs', () => {
  it('renders tabs for all 4 supported languages', () => {
    render(<TranslationTabs activeLang="en" onChange={() => {}} />);
    expect(screen.getByText(/English/)).toBeInTheDocument();
    expect(screen.getByText(/Spanish/)).toBeInTheDocument();
    expect(screen.getByText(/Mandarin/)).toBeInTheDocument();
    expect(screen.getByText(/Haitian Creole/)).toBeInTheDocument();
  });

  it('highlights the active language tab', () => {
    render(<TranslationTabs activeLang="es" onChange={() => {}} />);
    const esTab = screen.getByText(/Spanish/);
    expect(esTab.className).toContain('border-blue-600');
    expect(esTab.className).toContain('text-blue-600');
  });

  it('does not highlight inactive language tabs', () => {
    render(<TranslationTabs activeLang="en" onChange={() => {}} />);
    const zhTab = screen.getByText(/Mandarin/);
    expect(zhTab.className).not.toContain('border-blue-600');
    expect(zhTab.className).toContain('text-gray-500');
  });

  it('calls onChange with language code when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TranslationTabs activeLang="en" onChange={onChange} />);

    await user.click(screen.getByText(/Mandarin/));
    expect(onChange).toHaveBeenCalledWith('zh');
  });

  it('renders all 4 language buttons', () => {
    render(<TranslationTabs activeLang="en" onChange={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });
});
