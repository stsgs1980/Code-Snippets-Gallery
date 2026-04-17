'use client';

import { useRef, useEffect, memo } from 'react';
import { generatePreviewHTML } from '@/lib/preview-renderer';

// Module-level HTML cache: avoid regenerating for the same snippet
const htmlCache = new Map<string, string>();

interface SnippetPreviewProps {
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

    // Cache: generate HTML once per snippet
    let html = htmlCache.get(snippet.id);
    if (!html) {
      html = generatePreviewHTML(snippet);
      htmlCache.set(snippet.id, html);
    }

    // Use srcdoc — works reliably in sandboxed iframes (no cross-origin blob URL issues)
    iframe.srcdoc = html;
  }, [snippet.id]);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts allow-same-origin"
      className={`w-full h-full border-0 ${className || ''}`}
      title={`Preview: ${snippet.title}`}
    />
  );
});
