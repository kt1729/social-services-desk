import DOMPurify from 'dompurify';

interface RichTextDisplayProps {
  html: string;
  className?: string;
}

export default function RichTextDisplay({ html, className = '' }: RichTextDisplayProps) {
  const clean = DOMPurify.sanitize(html);
  return (
    <div
      className={`prose prose-sm max-w-none [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-blue-600 [&_a]:underline ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
