'use client';

import { useState } from 'react';
import { Heart, Copy, Check, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

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

interface CodeDialogProps {
  snippet: Snippet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CodeDialog({ snippet, open, onOpenChange, onLike, onDelete }: CodeDialogProps) {
  const [copied, setCopied] = useState(false);

  const badgeColor = LANGUAGE_BADGE_COLORS[snippet?.language || ''] || '';

  const handleCopy = async () => {
    if (!snippet) return;
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = snippet.code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = () => {
    if (!snippet) return;
    onLike(snippet.id);
  };

  const lines = snippet?.code.split('\n') || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl sm:max-w-4xl max-h-[90vh] flex flex-col p-0">
        {snippet && (
          <>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b shrink-0">
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <DialogTitle className="text-xl">{snippet.title}</DialogTitle>
                    <DialogDescription className="text-sm">
                      by {snippet.author}
                    </DialogDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn('text-xs shrink-0', badgeColor)}
                  >
                    {snippet.language}
                  </Badge>
                </div>
                {snippet.description && (
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {snippet.description}
                  </p>
                )}
              </DialogHeader>
            </div>

            {/* Code block */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 sm:p-6">
                <div className="rounded-lg bg-muted/80 dark:bg-muted/40 p-4 overflow-x-auto">
                  <pre className="text-xs sm:text-sm font-mono leading-relaxed">
                    <code>
                      {lines.map((line, i) => (
                        <div key={i} className="flex hover:bg-muted/50 -mx-4 px-4">
                          <span className="inline-block w-8 sm:w-10 text-right mr-4 sm:mr-6 text-muted-foreground/40 select-none shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-foreground/85 whitespace-pre">{line}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </div>
            </ScrollArea>

            {/* Footer actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t shrink-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground hover:text-rose-500"
                  onClick={handleLike}
                >
                  <Heart className="size-4" />
                  <span className="text-sm">{snippet.likes}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                </Button>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                    <span className="text-sm">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Snippet</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete &quot;{snippet.title}&quot;? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(snippet.id)}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
