import { useRef } from 'react';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

interface FileUploadProps {
  label: string;
  accept?: string;
  file: File | null;
  onChange: (file: File | null) => void;
  existingFileName?: string;
}

export default function FileUpload({
  label,
  accept,
  file,
  onChange,
  existingFileName,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected && selected.size > MAX_FILE_SIZE_BYTES) {
      alert(
        `File is too large. Maximum size is 10MB. Selected file is ${(selected.size / (1024 * 1024)).toFixed(1)}MB.`,
      );
      e.target.value = '';
      return;
    }
    onChange(selected);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Choose File
        </button>
        <span className="text-sm text-gray-500 truncate">
          {file?.name ?? existingFileName ?? 'No file chosen'}
        </span>
        {(file || existingFileName) && (
          <button
            type="button"
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <p className="text-xs text-gray-400 mt-1">Max file size: 10MB</p>
    </div>
  );
}
