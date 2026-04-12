import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OperatingHoursInput from '../OperatingHoursInput';
import { createEmptySchedule } from '../../lib/operatingHours';
import type { OperatingHours } from '../../types';

function renderInput(value?: OperatingHours, onChange = vi.fn()) {
  const schedule = value ?? createEmptySchedule();
  return {
    onChange,
    ...render(<OperatingHoursInput value={schedule} onChange={onChange} />),
  };
}

describe('OperatingHoursInput', () => {
  it('renders 7 day rows', () => {
    renderInput();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
  });

  it('shows all days as Closed by default', () => {
    renderInput();
    const closedButtons = screen.getAllByText('Closed');
    expect(closedButtons).toHaveLength(7);
  });

  it('shows no time inputs when all closed', () => {
    renderInput();
    expect(screen.queryByLabelText(/open time/i)).not.toBeInTheDocument();
  });

  it('toggles a day to Open and calls onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderInput(undefined, onChange);

    const closedButtons = screen.getAllByText('Closed');
    await user.click(closedButtons[0]); // Click Monday's Closed button

    expect(onChange).toHaveBeenCalledTimes(1);
    const newSchedule = onChange.mock.calls[0][0];
    expect(newSchedule[0].open).toBe('09:00');
    expect(newSchedule[0].close).toBe('17:00');
  });

  it('toggles an Open day to Closed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const schedule = createEmptySchedule();
    schedule[0] = { day: 'mon', open: '08:00', close: '20:00' };
    renderInput(schedule, onChange);

    const openButton = screen.getByText('Open');
    await user.click(openButton);

    const newSchedule = onChange.mock.calls[0][0];
    expect(newSchedule[0].open).toBeNull();
    expect(newSchedule[0].close).toBeNull();
  });

  it('shows time inputs for open days', () => {
    const schedule = createEmptySchedule();
    schedule[0] = { day: 'mon', open: '08:00', close: '20:00' };
    renderInput(schedule);

    expect(screen.getByLabelText('Monday open time')).toHaveValue('08:00');
    expect(screen.getByLabelText('Monday close time')).toHaveValue('20:00');
  });

  it('copies hours to all days', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const schedule = createEmptySchedule();
    schedule[0] = { day: 'mon', open: '08:00', close: '22:00' };
    renderInput(schedule, onChange);

    await user.click(screen.getByText('Copy to all'));

    const newSchedule = onChange.mock.calls[0][0];
    for (const entry of newSchedule) {
      expect(entry.open).toBe('08:00');
      expect(entry.close).toBe('22:00');
    }
  });

  it('renders the label', () => {
    renderInput();
    expect(screen.getByText('Operating Hours')).toBeInTheDocument();
  });
});
