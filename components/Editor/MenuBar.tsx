'use client';

import { Editor } from '@tiptap/react';
import { LucideIcon, Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, List, ListOrdered, Undo, Redo, Quote } from 'lucide-react';

interface MenuBarProps {
  editor: Editor | null;
}

type ButtonItem = {
  type?: never;
  icon: LucideIcon;
  action: () => void;
  active?: string | Record<string, unknown>;
  disabled?: boolean;
};

type DividerItem = {
  type: 'divider';
};

type MenuItem = ButtonItem | DividerItem;

export default function MenuBar({ editor }: MenuBarProps) {
  if (!editor) return null;

  const items: MenuItem[] = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: 'bold' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic' },
    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: 'underline' },
    { type: 'divider' },
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: { heading: { level: 1 } } },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: { heading: { level: 2 } } },
    { type: 'divider' },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: 'bulletList' },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: 'orderedList' },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: 'blockquote' },
    { type: 'divider' },
    { icon: Undo, action: () => editor.chain().focus().undo().run(), disabled: !editor.can().undo() },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), disabled: !editor.can().redo() },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-white sticky top-0 z-10">
      {items.map((item, index) => {
        if (item.type === 'divider') {
          return <div key={index} className="w-px h-6 bg-border mx-1" />;
        }
        const Icon = item.icon;
        return (
          <button
            key={index}
            onClick={item.action}
            disabled={item.disabled}
            className={`p-2 rounded-md transition-colors ${
              item.active && editor.isActive(item.active)
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-secondary text-muted-foreground'
            } disabled:opacity-30`}
          >
            <Icon size={18} />
          </button>
        );
      })}
    </div>
  );
}
