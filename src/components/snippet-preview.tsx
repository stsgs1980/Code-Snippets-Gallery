'use client';

import { useRef, useEffect, memo } from 'react';
import { generatePreviewHTML } from '@/lib/preview-renderer';

// Module-level cache: avoid re-creating Blobs for the same snippet
const blobCache = new Map<string, string>();

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

    // Cache hit: reuse existing blob URL — zero allocations
    let url = blobCache.get(snippet.id);
    if (!url) {
      const html = generatePreviewHTML(snippet);
      const blob = new Blob([html], { type: 'text/html' });
      url = URL.createObjectURL(blob);
      blobCache.set(snippet.id, url);
    }

    iframe.src = url;

    return () => {
      // Don't revoke — keep in cache for revisit
    };
  }, [snippet.id]);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts"
      className={`w-full h-full border-0 ${className || ''}`}
      title={`Preview: ${snippet.title}`}
    />
  );
});
