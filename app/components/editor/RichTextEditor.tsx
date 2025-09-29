'use client';

import { Loader2 } from 'lucide-react';
import React, { lazy, Suspense, useEffect, useState } from 'react';

interface RichTextEditorProps {
  content?: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

// Lazy load the TiptapEditor component with named export
const TiptapEditor = lazy(() => 
  import('./TiptapEditor').then(module => ({ default: module.TiptapEditor }))
);

// Loading component for the editor
function EditorLoading() {
  return (
    <div className="flex items-center justify-center min-h-[300px] border rounded-lg bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
    </div>
  );
}

// Error boundary component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error('Error in RichTextEditor:', error);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return <div className="p-4 text-red-600 bg-red-50 rounded">Editor failed to load. Please refresh the page.</div>;
  }

  return <>{children}</>;
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
  }, []);

  // Don't render anything on the server
  if (!isMounted) {
    return <EditorLoading />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<EditorLoading />}>
        <TiptapEditor
          content={content}
          onChange={onChange}
          placeholder={placeholder}
          className={className}
        />
      </Suspense>
    </ErrorBoundary>
  );
}
