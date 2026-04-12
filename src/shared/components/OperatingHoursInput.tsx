import { DAYS_OF_WEEK } from '../lib/operatingHours';
import type { OperatingHours } from '../types';

interface OperatingHoursInputProps {
  value: OperatingHours;
  onChange: (hours: OperatingHours) => void;
}

export default function OperatingHoursInput({ value, onChange }: OperatingHoursInputProps) {
  const updateDay = (index: number, open: string | null, close: string | null) => {
    const updated = [...value];
    updated[index] = { ...updated[index], open, close };
    onChange(updated);
  };

  const toggleDay = (index: number) => {
    const entry = value[index];
    if (entry.open !== null) {
      updateDay(index, null, null);
    } else {
      updateDay(index, '09:00', '17:00');
    }
  };

  const copyToAll = (index: number) => {
    const source = value[index];
    onChange(value.map((entry) => ({ ...entry, open: source.open, close: source.close })));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
      <div className="space-y-2">
        {value.map((entry, index) => {
          const dayInfo = DAYS_OF_WEEK.find((d) => d.code === entry.day);
          const isOpen = entry.open !== null;

          return (
            <div key={entry.day} className="flex items-center gap-2">
              <span className="w-10 text-sm font-medium text-gray-600">{dayInfo?.short}</span>

              <button
                type="button"
                onClick={() => toggleDay(index)}
                className={`px-2 py-1 text-xs rounded border ${
                  isOpen
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'bg-gray-50 border-gray-300 text-gray-500'
                }`}
              >
                {isOpen ? 'Open' : 'Closed'}
              </button>

              {isOpen && (
                <>
                  <input
                    type="time"
                    value={entry.open ?? ''}
                    onChange={(e) => updateDay(index, e.target.value, entry.close)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                    aria-label={`${dayInfo?.label} open time`}
                  />
                  <span className="text-sm text-gray-400">to</span>
                  <input
                    type="time"
                    value={entry.close ?? ''}
                    onChange={(e) => updateDay(index, entry.open, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                    aria-label={`${dayInfo?.label} close time`}
                  />
                  <button
                    type="button"
                    onClick={() => copyToAll(index)}
                    className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                  >
                    Copy to all
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
