'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const LANGUAGES = ['All', 'JavaScript', 'Python', 'GLSL', 'Rust', 'Haskell', 'CSS', 'TypeScript'];
const CATEGORIES = [
  'All',
  'Generative Art',
  'Algorithms',
  'Shaders',
  'Data Visualization',
  'Creative Coding',
  'Interactive',
  'UI/UX',
];

interface FilterBarProps {
  activeLanguage: string;
  activeCategory: string;
  searchQuery: string;
  onLanguageChange: (lang: string) => void;
  onCategoryChange: (cat: string) => void;
  onSearchChange: (q: string) => void;
}

export function FilterBar({
  activeLanguage,
  activeCategory,
  searchQuery,
  onLanguageChange,
  onCategoryChange,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search snippets..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Language filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap mr-1">
          Language:
        </span>
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => onLanguageChange(lang)}
            className={cn(
              'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all',
              'border hover:opacity-90',
              activeLanguage === lang
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary'
            )}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap mr-1">
          Category:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={cn(
              'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all',
              'border hover:opacity-90',
              activeCategory === cat
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary'
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
