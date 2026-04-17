'use client';

import { Code2, Plus, Moon, Sun, Languages } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/use-locale';

interface HeaderProps {
  onAddClick: () => void;
}

export function Header({ onAddClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLocale();

  const toggleLocale = () => setLocale(locale === 'en' ? 'ru' : 'en');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
              <Code2 className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Code Aesthetic Snippets
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLocale}
              aria-label={t('header.toggleLang')}
              className="text-xs font-bold w-auto px-2 gap-1"
            >
              <Languages className="size-4" />
              <span className="hidden sm:inline" suppressHydrationWarning>{locale === 'en' ? 'РУС' : 'ENG'}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={t('header.toggleTheme')}
            >
              <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              size="sm"
              onClick={onAddClick}
              className="gap-1.5"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline" suppressHydrationWarning>{t('header.addSnippet')}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
