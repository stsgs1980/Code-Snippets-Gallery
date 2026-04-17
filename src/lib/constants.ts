/** Shared language color constants — single source of truth */

export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: 'bg-amber-500',
  Python: 'bg-green-500',
  GLSL: 'bg-purple-500',
  Rust: 'bg-orange-500',
  Haskell: 'bg-cyan-500',
  CSS: 'bg-pink-500',
  TypeScript: 'bg-blue-500',
};

export const LANGUAGE_BADGE_COLORS: Record<string, string> = {
  JavaScript: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  Python: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  GLSL: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  Rust: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  Haskell: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20',
  CSS: 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20',
  TypeScript: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
};

export const LANGUAGES = ['All', 'JavaScript', 'Python', 'GLSL', 'Rust', 'Haskell', 'CSS', 'TypeScript'] as const;

export const CATEGORIES = [
  'All',
  'Generative Art',
  'Algorithms',
  'Shaders',
  'Data Visualization',
  'Creative Coding',
  'Interactive',
  'UI/UX',
] as const;

export const CATEGORIES_WITHOUT_ALL = CATEGORIES.filter(c => c !== 'All');
