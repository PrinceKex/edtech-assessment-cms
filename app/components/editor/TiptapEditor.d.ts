
declare module './TiptapEditor' {
  interface TiptapEditorProps {
    content?: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
  }

  export const TiptapEditor: React.FC<TiptapEditorProps>;
}
