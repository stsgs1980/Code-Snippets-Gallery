'use client';

import { useRef, useEffect, memo } from 'react';
import { generatePreviewHTML, hasInteractivePreview } from '@/lib/preview-renderer';

interface SnippetPreviewProps {
  snippetId: string;
  snippet: {
    id: string;
    title: string;
    description: string;
    code: string;
    language: string;
    category: string;
    author: string;
  };
  className?: string;
}

export const SnippetPreview = memo(function SnippetPreview({ snippet, className }: SnippetPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const html = generatePreviewHTML(snippet);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [snippet]);

  const interactive = hasInteractivePreview(snippet.id);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts"
      className={`w-full h-full border-0 ${className || ''}`}
      title={`Preview: ${snippet.title}`}
    />
  );
});
