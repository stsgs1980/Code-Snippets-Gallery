'use client';

import { Code2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Code2 className="size-4" />
            <span>Code Aesthetic Gallery &copy; 2025</span>
          </div>
          <p className="text-xs">
            Built with Next.js, Tailwind CSS &amp; shadcn/ui
          </p>
        </div>
      </div>
    </footer>
  );
}
