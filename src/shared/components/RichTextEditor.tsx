import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
    ],
    content: value,
    onUpdate({ editor: e }) {
      const html = e.getHTML();
      // Treat empty document as empty string
      onChange(html === '<p></p>' ? '' : html);
    },
  });

  // Sync external value changes (e.g. language tab switch)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = value || '';
    if (current !== incoming && !(current === '<p></p>' && incoming === '')) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [value, editor]);

  const setLink = () => {
    const url = window.prompt('Enter URL');
    if (!url) return;
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const toolbarBtn = (
    active: boolean,
    onClick: () => void,
    label: string,
    title: string,
  ) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      aria-label={title}
      className={`px-2 py-1 rounded text-sm font-medium border transition-colors ${
        active
          ? 'bg-blue-100 border-blue-400 text-blue-700'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {toolbarBtn(
          editor?.isActive('bold') ?? false,
          () => editor?.chain().focus().toggleBold().run(),
          'B',
          'Bold',
        )}
        {toolbarBtn(
          editor?.isActive('italic') ?? false,
          () => editor?.chain().focus().toggleItalic().run(),
          'I',
          'Italic',
        )}
        {toolbarBtn(
          editor?.isActive('bulletList') ?? false,
          () => editor?.chain().focus().toggleBulletList().run(),
          '• List',
          'Bullet List',
        )}
        {toolbarBtn(
          editor?.isActive('orderedList') ?? false,
          () => editor?.chain().focus().toggleOrderedList().run(),
          '1. List',
          'Ordered List',
        )}
        {toolbarBtn(editor?.isActive('link') ?? false, setLink, '🔗 Link', 'Add Link')}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor?.chain().focus().unsetAllMarks().clearNodes().run();
          }}
          title="Clear Formatting"
          aria-label="Clear Formatting"
          className="px-2 py-1 rounded text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ✕ Clear
        </button>
      </div>
      <div className="relative">
        {editor && editor.isEmpty && placeholder && (
          <p className="absolute top-2 left-3 text-gray-400 text-sm pointer-events-none select-none">
            {placeholder}
          </p>
        )}
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-3 min-h-[80px] focus-within:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_a]:text-blue-600 [&_.ProseMirror_a]:underline"
        />
      </div>
    </div>
  );
}
