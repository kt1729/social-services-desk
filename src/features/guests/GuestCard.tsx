import { Link } from 'react-router-dom';
import { LANGUAGE_LABELS } from '../../shared/lib/languages';
import { getCategoryLabel } from '../../shared/lib/categories';
import type { Guest } from '../../shared/types';

interface GuestCardProps {
  guest: Guest;
}

export default function GuestCard({ guest }: GuestCardProps) {
  const visitCount = guest.visitLog?.length ?? 0;
  const lastVisit = guest.visitLog?.length
    ? guest.visitLog[guest.visitLog.length - 1].date?.toDate?.()?.toLocaleDateString()
    : null;

  return (
    <Link
      to={`/guests/${guest.id}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900">
          👤 {guest.firstName} {guest.lastInitial}.
        </h3>
        <span className="text-xs text-gray-500">{LANGUAGE_LABELS[guest.preferredLanguage]}</span>
      </div>

      {guest.needs?.length > 0 && (
        <p className="text-sm text-gray-600 mb-2">
          Needs: {guest.needs.map((n) => getCategoryLabel(n)).join(', ')}
        </p>
      )}

      <div className="text-xs text-gray-400 flex gap-3">
        <span>Visits: {visitCount}</span>
        {lastVisit && <span>Last: {lastVisit}</span>}
      </div>

      {guest.quickNotes?.length > 0 && (
        <p className="text-xs text-gray-500 mt-2 line-clamp-1">
          "{guest.quickNotes[guest.quickNotes.length - 1].text}"
        </p>
      )}
    </Link>
  );
}
