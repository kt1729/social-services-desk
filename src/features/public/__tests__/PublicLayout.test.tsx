import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from '../PublicLayout';

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/public']}>
      <Routes>
        <Route path="/public" element={<PublicLayout />}>
          <Route index element={<div>Outlet</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('PublicLayout', () => {
  it('renders a search input', () => {
    renderLayout();
    expect(screen.getByPlaceholderText('Search resources and documents')).toBeInTheDocument();
  });

  it('does not render public nav links or volunteer login', () => {
    renderLayout();

    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    expect(screen.queryByText('Resources')).not.toBeInTheDocument();
    expect(screen.queryByText('Documents')).not.toBeInTheDocument();
    expect(screen.queryByText('Volunteer Login')).not.toBeInTheDocument();
  });

  it('opens QR modal when clicking the QR icon', async () => {
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByLabelText('Open QR code'));
    const modal = screen.getByTestId('public-qr-modal');
    expect(modal).toBeInTheDocument();

    const qrImage = modal.querySelector('image');
    expect(qrImage).not.toBeNull();
  });

  it('hides the QR icon on mobile viewports via responsive class', () => {
    renderLayout();
    const qrButton = screen.getByLabelText('Open QR code');
    expect(qrButton.className).toContain('hidden');
    expect(qrButton.className).toContain('md:inline-flex');
  });
});
