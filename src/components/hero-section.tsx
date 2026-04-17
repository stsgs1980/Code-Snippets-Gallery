'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Palette, Layers } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';

interface Stats {
  totalSnippets: number;
  languages: number;
  categories: number;
}

export function HeroSection() {
  const { t } = useLocale();
  const [stats, setStats] = useState<Stats>({
    totalSnippets: 0,
    languages: 0,
    categories: 0,
  });
  const [hasStats, setHasStats] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/snippets?stats=true')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setStats({
          totalSnippets: data.total ?? 0,
          languages: data.languages?.length ?? 0,
          categories: data.categories?.length ?? 0,
        });
        setHasStats(true);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const statItems = [
    { icon: Code2, label: t('hero.statSnippets'), value: stats.totalSnippets },
    { icon: Palette, label: t('hero.statLanguages'), value: stats.languages },
    { icon: Layers, label: t('hero.statCategories'), value: stats.categories },
  ];

  return (
    <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
          suppressHydrationWarning
        >
          {t('hero.title1')}{' '}
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            {t('hero.titleHighlight1')}
          </span>{' '}
          {t('hero.title2')}{' '}
          <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent">
            {t('hero.titleHighlight2')}
          </span>
          {t('hero.title3')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          suppressHydrationWarning
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Stats */}
        {hasStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="mt-8 sm:mt-10 flex items-center justify-center gap-6 sm:gap-10"
          >
            {statItems.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <stat.icon className="size-4 text-primary" />
                <span className="font-semibold text-foreground">{stat.value}</span>
                <span suppressHydrationWarning>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
