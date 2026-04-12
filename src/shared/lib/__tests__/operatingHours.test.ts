import { describe, it, expect } from 'vitest';
import {
  DAYS_OF_WEEK,
  createEmptySchedule,
  formatTime,
  formatOperatingHours,
} from '../operatingHours';
import type { OperatingHours } from '../../types';

describe('DAYS_OF_WEEK', () => {
  it('has 7 entries', () => {
    expect(DAYS_OF_WEEK).toHaveLength(7);
  });

  it('starts with Monday and ends with Sunday', () => {
    expect(DAYS_OF_WEEK[0].code).toBe('mon');
    expect(DAYS_OF_WEEK[6].code).toBe('sun');
  });
});

describe('createEmptySchedule', () => {
  it('returns 7 day entries all closed', () => {
    const schedule = createEmptySchedule();
    expect(schedule).toHaveLength(7);
    for (const entry of schedule) {
      expect(entry.open).toBeNull();
      expect(entry.close).toBeNull();
    }
  });

  it('has days in order mon through sun', () => {
    const schedule = createEmptySchedule();
    const codes = schedule.map((s) => s.day);
    expect(codes).toEqual(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
  });
});

describe('formatTime', () => {
  it('formats morning time', () => {
    expect(formatTime('08:00')).toBe('8:00 AM');
  });

  it('formats noon', () => {
    expect(formatTime('12:00')).toBe('12:00 PM');
  });

  it('formats afternoon time', () => {
    expect(formatTime('14:30')).toBe('2:30 PM');
  });

  it('formats midnight', () => {
    expect(formatTime('00:00')).toBe('12:00 AM');
  });

  it('formats 9 PM', () => {
    expect(formatTime('21:00')).toBe('9:00 PM');
  });
});

describe('formatOperatingHours', () => {
  it('returns empty array when all days are closed', () => {
    const hours = createEmptySchedule();
    expect(formatOperatingHours(hours)).toEqual([]);
  });

  it('returns empty array for empty input', () => {
    expect(formatOperatingHours([])).toEqual([]);
  });

  it('formats all days with same hours as "Every day"', () => {
    const hours: OperatingHours = DAYS_OF_WEEK.map((d) => ({
      day: d.code,
      open: '08:00',
      close: '22:00',
    }));
    expect(formatOperatingHours(hours)).toEqual(['Every day: 8:00 AM – 10:00 PM']);
  });

  it('groups weekdays and weekend separately', () => {
    const hours: OperatingHours = DAYS_OF_WEEK.map((d) => ({
      day: d.code,
      open: ['sat', 'sun'].includes(d.code) ? '10:00' : '09:00',
      close: ['sat', 'sun'].includes(d.code) ? '14:00' : '17:00',
    }));
    expect(formatOperatingHours(hours)).toEqual([
      'Mon–Fri: 9:00 AM – 5:00 PM',
      'Sat–Sun: 10:00 AM – 2:00 PM',
    ]);
  });

  it('shows closed day separately', () => {
    const hours: OperatingHours = DAYS_OF_WEEK.map((d) => ({
      day: d.code,
      open: d.code === 'sun' ? null : '08:00',
      close: d.code === 'sun' ? null : '20:00',
    }));
    expect(formatOperatingHours(hours)).toEqual(['Mon–Sat: 8:00 AM – 8:00 PM', 'Sun: Closed']);
  });

  it('handles single day with different hours', () => {
    const hours: OperatingHours = DAYS_OF_WEEK.map((d) => ({
      day: d.code,
      open: d.code === 'wed' ? '10:00' : '08:00',
      close: d.code === 'wed' ? '15:00' : '20:00',
    }));
    expect(formatOperatingHours(hours)).toEqual([
      'Mon–Tue: 8:00 AM – 8:00 PM',
      'Wed: 10:00 AM – 3:00 PM',
      'Thu–Sun: 8:00 AM – 8:00 PM',
    ]);
  });
});
