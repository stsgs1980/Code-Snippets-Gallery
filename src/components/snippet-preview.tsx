'use client';

import { useRef, useEffect, memo } from 'react';
import { generatePreviewHTML } from '@/lib/preview-renderer';

// LRU HTML cache: bounded to MAX_CACHE_SIZE entries
const MAX_CACHE_SIZE = 100;
const htmlCache = new Map<string, string>();

function getCachedHTML(id: string): string | undefined {
  const html = htmlCache.get(id);
  if (html) {
    htmlCache.delete(id);
    htmlCache.set(id, html);
  }
  return html;
}

function setCachedHTML(id: string, html: string) {
  if (htmlCache.size >= MAX_CACHE_SIZE) {
    const firstKey = htmlCache.keys().next().value;
    if (firstKey) htmlCache.delete(firstKey);
  }
  htmlCache.set(id, html);
}

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
    let html = getCachedHTML(snippet.id);
    if (!html) {
      html = generatePreviewHTML(snippet);
      setCachedHTML(snippet.id, html);
    }

    // Use srcdoc - works reliably in sandboxed iframes (no cross-origin blob URL issues)
    iframe.srcdoc = html;
  }, [snippet.id]);

  return (
    <iframe
      ref={iframeRef}
      // Security note: allow-scripts + allow-same-origin is required for WebGL.
      // User input is escaped via escapeHtml() in preview-renderer.ts to prevent XSS.
      // For full isolation, consider CSP headers or a web worker approach in production.
      sandbox="allow-scripts allow-same-origin"
      className={`w-full h-full border-0 ${className || ''}`}
      title={`Preview: ${snippet.title}`}
    />
  );
});
