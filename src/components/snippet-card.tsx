'use client';

import { motion } from 'framer-motion';
import { Heart, Star, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: 'bg-amber-500',
  Python: 'bg-green-500',
  GLSL: 'bg-purple-500',
  Rust: 'bg-orange-500',
  Haskell: 'bg-cyan-500',
  CSS: 'bg-pink-500',
  TypeScript: 'bg-blue-500',
};

const LANGUAGE_BADGE_COLORS: Record<string, string> = {
  JavaScript: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  Python: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  GLSL: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  Rust: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  Haskell: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20',
  CSS: 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20',
  TypeScript: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
};

interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  author: string;
  isFeatured: boolean;
  likes: number;
}

interface SnippetCardProps {
  snippet: Snippet;
  onViewCode: (snippet: Snippet) => void;
  onLike: (id: string) => void;
}

function getPreviewLines(code: string, maxLines = 5): string {
  return code
    .split('\n')
    .slice(0, maxLines)
    .join('\n');
}

export function SnippetCard({ snippet, onViewCode, onLike }: SnippetCardProps) {
  const accentColor = LANGUAGE_COLORS[snippet.language] || 'bg-gray-500';
  const badgeColor = LANGUAGE_BADGE_COLORS[snippet.language] || '';
  const preview = getPreviewLines(snippet.code);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative rounded-xl border bg-card shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      {/* Top accent bar */}
      <div className={cn('h-1', accentColor)} />

      <div className="p-4 sm:p-5 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm sm:text-base leading-tight line-clamp-1 flex-1">
            {snippet.title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            {snippet.isFeatured && (
              <Star className="size-4 fill-amber-400 text-amber-400" />
            )}
            <Badge
              variant="outline"
              className={cn('text-[10px] px-1.5 py-0', badgeColor)}
            >
              {snippet.language}
            </Badge>
          </div>
        </div>

        {/* Author */}
        <p className="text-xs text-muted-foreground">
          by {snippet.author}
        </p>

        {/* Description */}
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {snippet.description}
        </p>

        {/* Code preview */}
        <div className="relative rounded-lg bg-muted/80 dark:bg-muted/40 p-3 overflow-hidden">
          <pre className="text-[11px] sm:text-xs font-mono leading-relaxed text-foreground/70 overflow-hidden">
            <code>{preview}</code>
          </pre>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/80 dark:from-muted/40 to-transparent" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-muted-foreground hover:text-rose-500"
            onClick={() => onLike(snippet.id)}
          >
            <Heart className="size-3.5" />
            <span className="text-xs">{snippet.likes}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => onViewCode(snippet)}
          >
            <Eye className="size-3.5" />
            View Code
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
