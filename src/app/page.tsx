'use client';

import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { FilterBar } from '@/components/filter-bar';
import { SnippetCard } from '@/components/snippet-card';
import { CodeDialog } from '@/components/code-dialog';
import { AddSnippetDialog } from '@/components/add-snippet-dialog';
import { Footer } from '@/components/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LocaleProvider, useLocale } from '@/hooks/use-locale';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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

function GalleryContent() {
  const [activeLanguage, setActiveLanguage] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useLocale();
  const queryClientInstance = useQueryClient();

  const { data: snippets = [], isLoading } = useQuery<Snippet[]>({
    queryKey: ['snippets', activeLanguage, activeCategory, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeLanguage !== 'All') params.set('language', activeLanguage);
      if (activeCategory !== 'All') params.set('category', activeCategory);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/snippets?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch snippets');
      return res.json();
    },
  });

  const handleViewCode = useCallback((snippet: Snippet) => {
    setSelectedSnippet(snippet);
    setCodeDialogOpen(true);
  }, []);

  const handleLike = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/snippets/${id}/like`, { method: 'POST' });
      if (res.ok) {
        queryClientInstance.setQueryData<Snippet[]>(
          ['snippets', activeLanguage, activeCategory, searchQuery],
          (old) => old?.map((s) => (s.id === id ? { ...s, likes: s.likes + 1 } : s))
        );
      }
    } catch {
      toast({
        title: t('toast.error'),
        description: t('toast.likeFailed'),
        variant: 'destructive',
      });
    }
  }, [toast, queryClientInstance, activeLanguage, activeCategory, searchQuery, t]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/snippets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        queryClientInstance.setQueryData<Snippet[]>(
          ['snippets', activeLanguage, activeCategory, searchQuery],
          (old) => old?.filter((s) => s.id !== id)
        );
        setCodeDialogOpen(false);
        setSelectedSnippet(null);
        toast({
          title: t('toast.deleted'),
          description: t('toast.deleteSuccess'),
        });
      }
    } catch {
      toast({
        title: t('toast.error'),
        description: t('toast.deleteFailed'),
        variant: 'destructive',
      });
    }
  }, [toast, queryClientInstance, activeLanguage, activeCategory, searchQuery, t]);

  const handleAddSnippet = useCallback(async (data: {
    title: string;
    language: string;
    category: string;
    author: string;
    description: string;
    code: string;
  }) => {
    try {
      const res = await fetch('/api/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast({
          title: t('toast.success'),
          description: t('toast.addSuccess'),
        });
        queryClientInstance.invalidateQueries({ queryKey: ['snippets'] });
      } else {
        const err = await res.json();
        toast({
          title: t('toast.error'),
          description: err.error || t('toast.addFailed'),
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: t('toast.error'),
        description: t('toast.addFailed'),
        variant: 'destructive',
      });
    }
  }, [toast, queryClientInstance, t]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onAddClick={() => setAddDialogOpen(true)} />

      <main className="flex-1 pt-16">
        <HeroSection />

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          {/* Filters */}
          <div className="mb-8">
            <FilterBar
              activeLanguage={activeLanguage}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              onLanguageChange={setActiveLanguage}
              onCategoryChange={setActiveCategory}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Snippet Grid */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : snippets.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {snippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onViewCode={handleViewCode}
                  onLike={handleLike}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Dialogs */}
      <CodeDialog
        snippet={selectedSnippet}
        open={codeDialogOpen}
        onOpenChange={setCodeDialogOpen}
        onLike={handleLike}
        onDelete={handleDelete}
      />

      <AddSnippetDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddSnippet}
      />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card overflow-hidden">
          <Skeleton className="h-1 w-full" />
          <div className="p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="rounded-lg bg-muted/80 p-3 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  const { t } = useLocale();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-4">
        <SearchX className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{t('empty.title')}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        {t('empty.desc')}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <GalleryContent />
      </LocaleProvider>
    </QueryClientProvider>
  );
}
