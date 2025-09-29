'use client';

import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({ content, onChange, placeholder, className = '' }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-5',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-5',
          },
        },
      }),
      Image,
      Placeholder.configure({
        placeholder: placeholder || 'Write something amazing...',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 min-h-[300px]',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (content !== html) {
        onChange(html);
      }
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-[300px] border rounded-lg bg-gray-50">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="min-h-[300px]" />
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
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded ${
          editor.isActive('strike') ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
        title="Strikethrough"
      >
        <s>S</s>
      </button>
      <div className="w-px h-8 bg-gray-200 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded ${
          editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
        title="Heading 1"
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded ${
          editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
        title="Heading 2"
      >
        H2
      </button>
      <div className="w-px h-8 bg-gray-200 mx-1" />
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
        title="Ordered List"
      >
        1.
      </button>
      <div className="w-px h-8 bg-gray-200 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
        title="Undo"
      >
        ↺
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
        title="Redo"
      >
        ↻
      </button>
    </div>
  );
}
