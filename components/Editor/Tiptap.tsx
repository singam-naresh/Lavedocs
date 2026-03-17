'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import MenuBar from './MenuBar';

interface TiptapProps {
  content: string;
  onChange: (content: string) => void;
}

export default function Tiptap({ content, onChange }: TiptapProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Start writing your document…',
      }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none focus:outline-none min-h-[500px] p-8 md:p-12 font-serif text-lg leading-relaxed',
      },
    },
  });

  return (
    <div className="w-full bg-white rounded-xl border shadow-sm overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
