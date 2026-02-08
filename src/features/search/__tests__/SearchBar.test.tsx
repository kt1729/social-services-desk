import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SearchBar from '../SearchBar';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderSearchBar(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <SearchBar />
    </MemoryRouter>,
  );
}

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the search input', () => {
    renderSearchBar();
    expect(
      screen.getByPlaceholderText('Search resources, documents, guests...'),
    ).toBeInTheDocument();
  });

  it('navigates on form submit (Enter key)', async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByPlaceholderText('Search resources, documents, guests...');
    await user.type(input, 'food{Enter}');

    expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/search?q=food'));
  });

  it('does not navigate on submit with empty query', async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByPlaceholderText('Search resources, documents, guests...');
    await user.click(input);
    // Submit empty form
    const form = input.closest('form')!;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    // Should not have been called with a search route (may have been called by debounce)
    const searchCalls = mockNavigate.mock.calls.filter(
      (call) => typeof call[0] === 'string' && call[0].startsWith('/search'),
    );
    expect(searchCalls).toHaveLength(0);
  });

  it('debounces navigation while typing', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderSearchBar();

    const input = screen.getByPlaceholderText('Search resources, documents, guests...');
    await user.type(input, 'shel');

    // Before debounce fires, no navigation yet
    expect(mockNavigate).not.toHaveBeenCalled();

    // Advance timer past debounce delay
    vi.advanceTimersByTime(350);

    expect(mockNavigate).toHaveBeenCalledWith('/search?q=shel', { replace: true });
  });

  it('renders search icon SVG', () => {
    renderSearchBar();
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('initializes query from URL search params', () => {
    renderSearchBar('/search?q=existing');
    const input = screen.getByPlaceholderText(
      'Search resources, documents, guests...',
    ) as HTMLInputElement;
    expect(input.value).toBe('existing');
  });
});
