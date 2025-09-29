'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  content?: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  content = "",
  onChange,
  placeholder = "Write something amazing...",
  className = "",
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '<p>Start typing here...</p>',
    editorProps: {
      attributes: {
        class: 'min-h-[300px] p-4 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update content when the prop changes
  useEffect(() => {
    if (!editor || !isMounted) return;
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content || '<p>Start typing here...</p>');
    }
  }, [content, editor, isMounted]);

  if (!isMounted) {
    return (
      <div className="min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg p-4">
        <p>Loading editor...</p>
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="min-h-[300px] border-2 border-dashed border-red-300 rounded-lg p-4">
        <p className="text-red-500">Failed to initialize editor</p>
      </div>
    );
  }

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      <MenuBar editor={editor} />
      <div className="p-4 border-t border-gray-200">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function MenuBar({ editor }: { editor: any }) {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 bg-white p-2 flex flex-wrap gap-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded ${
          editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
        title="Bold"
      >
        <span className="font-bold">B</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${
          editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${
          editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
        title="Bullet List"
      >
        •
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded ${
          editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
        title="Numbered List"
      >
        1.
      </button>
    </div>
  );
}
