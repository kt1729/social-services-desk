import type { DayOfWeek, DaySchedule, OperatingHours } from '../types';

export const DAYS_OF_WEEK: { code: DayOfWeek; label: string; short: string }[] = [
  { code: 'mon', label: 'Monday', short: 'Mon' },
  { code: 'tue', label: 'Tuesday', short: 'Tue' },
  { code: 'wed', label: 'Wednesday', short: 'Wed' },
  { code: 'thu', label: 'Thursday', short: 'Thu' },
  { code: 'fri', label: 'Friday', short: 'Fri' },
  { code: 'sat', label: 'Saturday', short: 'Sat' },
  { code: 'sun', label: 'Sunday', short: 'Sun' },
];

export function createEmptySchedule(): OperatingHours {
  return DAYS_OF_WEEK.map((d) => ({ day: d.code, open: null, close: null }));
}

export function formatTime(time: string): string {
  const [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr ?? '00';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${hour}:${minute} ${ampm}`;
}

function dayShort(day: DayOfWeek): string {
  return DAYS_OF_WEEK.find((d) => d.code === day)!.short;
}

function sameHours(a: DaySchedule, b: DaySchedule): boolean {
  return a.open === b.open && a.close === b.close;
}

export function formatOperatingHours(hours: OperatingHours): string[] {
  if (hours.length === 0) return [];

  const allClosed = hours.every((d) => d.open === null);
  if (allClosed) return [];

  const allSame = hours.every((d) => d.open !== null) && hours.every((d) => sameHours(d, hours[0]));
  if (allSame) {
    return [`Every day: ${formatTime(hours[0].open!)} – ${formatTime(hours[0].close!)}`];
  }

  const lines: string[] = [];
  let i = 0;

  while (i < hours.length) {
    const start = hours[i];
    let end = start;
    let j = i + 1;

    while (j < hours.length && sameHours(hours[j], start)) {
      end = hours[j];
      j++;
    }

    const startLabel = dayShort(start.day);
    const endLabel = dayShort(end.day);
    const range = start === end ? startLabel : `${startLabel}–${endLabel}`;

    if (start.open === null) {
      lines.push(`${range}: Closed`);
    } else {
      lines.push(`${range}: ${formatTime(start.open)} – ${formatTime(start.close!)}`);
    }

    i = j;
  }

  return lines;
}
