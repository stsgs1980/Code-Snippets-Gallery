'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { Locale, DictKey } from '@/lib/i18n';
import { t, tCategory } from '@/lib/i18n';

const STORAGE_KEY = 'code-aesthetic-locale';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: DictKey) => string;
  tCat: (cat: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readSavedLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'ru') return stored;
  } catch {}
  const browserLang = navigator.language?.slice(0, 2);
  return browserLang === 'ru' ? 'ru' : 'en';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readSavedLocale);
  const mountedRef = useRef(false);

  // Sync html lang attribute with locale changes after mount
  useEffect(() => {
    mountedRef.current = true;
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

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
