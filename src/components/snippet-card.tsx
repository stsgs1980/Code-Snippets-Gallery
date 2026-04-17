'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Eye, Code2, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SnippetPreview } from '@/components/snippet-preview';
import { useLocale } from '@/hooks/use-locale';
import { LANGUAGE_COLORS, LANGUAGE_BADGE_COLORS } from '@/lib/constants';

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
  return code.split('\n').slice(0, maxLines).join('\n');
}

type TabType = 'preview' | 'code';

export function SnippetCard({ snippet, onViewCode, onLike }: SnippetCardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('preview');
  const { t } = useLocale();
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
          {t('card.by')} {snippet.author}
        </p>

        {/* Description */}
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {snippet.description}
        </p>

        {/* Tab bar + Content */}
        <div className="rounded-lg overflow-hidden border border-border/50">
          {/* Tab buttons */}
          <div className="flex border-b border-border/50 bg-muted/40" role="tablist">
            <button
              onClick={() => setActiveTab('preview')}
              role="tab"
              aria-selected={activeTab === 'preview'}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-colors',
                activeTab === 'preview'
                  ? 'text-foreground bg-background border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Play className="size-3" />
              {t('card.preview')}
            </button>
            <button
              onClick={() => setActiveTab('code')}
              role="tab"
              aria-selected={activeTab === 'code'}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-colors',
                activeTab === 'code'
                  ? 'text-foreground bg-background border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Code2 className="size-3" />
              {t('card.code')}
            </button>
          </div>

          {/* Tab content */}
          <div className="relative bg-[#0c0c14] dark:bg-[#08080e]" style={{ height: '160px' }}>
            {activeTab === 'preview' && (
              <SnippetPreview snippet={snippet} />
            )}

            {activeTab === 'code' && (
              <div className="relative h-full overflow-hidden p-3">
                <pre className="text-[11px] sm:text-xs font-mono leading-relaxed text-foreground/60 overflow-hidden">
                  <code>{preview}</code>
                </pre>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0c0c14] dark:from-[#08080e] to-transparent pointer-events-none" />
              </div>
            )}
          </div>
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
            {t('card.viewCode')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
