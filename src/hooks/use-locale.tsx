'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Locale, DictKey } from '@/lib/i18n';
import { t, tCategory } from '@/lib/i18n';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: DictKey) => string;
  tCat: (cat: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const tc = useCallback((key: DictKey) => t(key, locale), [locale]);
  const tCatFn = useCallback((cat: string) => tCategory(cat, locale), [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: tc, tCat: tCatFn }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>');
  return ctx;
}
