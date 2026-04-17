'use client';

import { createContext, useContext, useCallback, useEffect, useSyncExternalStore, type ReactNode } from 'react';
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

let cachedLocale: Locale | null = null;
const listeners = new Set<() => void>();

function emitChange() {
  for (const fn of listeners) fn();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

function getSnapshot(): Locale {
  if (cachedLocale !== null) return cachedLocale;
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'ru') {
      cachedLocale = stored;
      return stored;
    }
  } catch {}
  const browserLang = navigator.language?.slice(0, 2);
  cachedLocale = browserLang === 'ru' ? 'ru' : 'en';
  return cachedLocale;
}

function getServerSnapshot(): Locale {
  return 'en';
}

function applyLocale(l: Locale) {
  cachedLocale = l;
  try {
    localStorage.setItem(STORAGE_KEY, l);
  } catch {}
  emitChange();
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Sync html lang attribute whenever locale changes
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    applyLocale(l);
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
