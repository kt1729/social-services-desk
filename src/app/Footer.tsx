import { useConnectionStatus } from '../shared/hooks/useConnectionStatus';

export default function Footer() {
  const connected = useConnectionStatus();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-500 flex items-center gap-4 print-hidden">
      <span className="flex items-center gap-1.5">
        <span
          className={`inline-block w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
        />
        {connected ? 'Connected' : 'Disconnected'}
      </span>
    </footer>
  );
}
