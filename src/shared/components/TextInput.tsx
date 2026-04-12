interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function TextInput({ label, id, className, ...props }: TextInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className ?? ''}`}
        {...props}
      />
    </div>
  );
}
