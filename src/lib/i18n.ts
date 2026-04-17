export type Locale = 'en' | 'ru';

const dict = {
  // ============================================================
  //  HEADER
  // ============================================================
  'header.addSnippet':    { en: 'Add Snippet',    ru: 'Добавить' },

  // ============================================================
  //  HERO
  // ============================================================
  'hero.title1':          { en: 'Where',          ru: 'Где' },
  'hero.titleHighlight1': { en: 'Code',           ru: 'Код' },
  'hero.title2':          { en: 'Meets',          ru: 'Встречается' },
  'hero.titleHighlight2': { en: 'Art',            ru: 'С' },
  'hero.title3':          { en: '',               ru: 'Искусством' },
  'hero.subtitle':        { en: 'A curated gallery of beautiful code — algorithms, shaders, generative art, and creative coding masterpieces', ru: 'Подборка красивого кода — алгоритмы, шейдеры, генеративное искусство и шедевры креативного программирования' },
  'hero.statSnippets':    { en: 'Snippets',       ru: 'Сниппетов' },
  'hero.statLanguages':   { en: 'Languages',      ru: 'Языков' },
  'hero.statCategories':  { en: 'Categories',     ru: 'Категорий' },

  // ============================================================
  //  FILTER BAR
  // ============================================================
  'filter.search':        { en: 'Search snippets...',    ru: 'Поиск сниппетов...' },
  'filter.language':      { en: 'Language:',             ru: 'Язык:' },
  'filter.category':      { en: 'Category:',             ru: 'Категория:' },
  'filter.all':           { en: 'All',                   ru: 'Все' },

  'cat.generativeArt':    { en: 'Generative Art',        ru: 'Генеративное иск.' },
  'cat.algorithms':       { en: 'Algorithms',            ru: 'Алгоритмы' },
  'cat.shaders':          { en: 'Shaders',               ru: 'Шейдеры' },
  'cat.dataViz':          { en: 'Data Visualization',    ru: 'Визуализация' },
  'cat.creativeCoding':   { en: 'Creative Coding',       ru: 'Креативное код.' },
  'cat.interactive':      { en: 'Interactive',           ru: 'Интерактивное' },
  'cat.uiux':             { en: 'UI/UX',                 ru: 'UI/UX' },

  // ============================================================
  //  SNIPPET CARD
  // ============================================================
  'card.preview':         { en: 'Preview',    ru: 'Превью' },
  'card.code':            { en: 'Code',       ru: 'Код' },
  'card.viewCode':        { en: 'View Code',  ru: 'Код' },
  'card.by':              { en: 'by',         ru: 'от' },

  // ============================================================
  //  CODE DIALOG
  // ============================================================
  'dialog.copy':          { en: 'Copy',       ru: 'Копировать' },
  'dialog.copied':        { en: 'Copied!',    ru: 'Скопировано!' },
  'dialog.delete':        { en: 'Delete',     ru: 'Удалить' },
  'dialog.deleteTitle':   { en: 'Delete Snippet',            ru: 'Удалить сниппет' },
  'dialog.deleteConfirm': { en: 'Are you sure you want to delete', ru: 'Вы уверены, что хотите удалить' },
  'dialog.deleteUndo':    { en: 'This action cannot be undone.', ru: 'Это действие нельзя отменить.' },
  'dialog.cancel':        { en: 'Cancel',     ru: 'Отмена' },

  // ============================================================
  //  ADD SNIPPET DIALOG
  // ============================================================
  'add.title':            { en: 'Add New Snippet',                ru: 'Новый сниппет' },
  'add.subtitle':         { en: 'Share a beautiful piece of code with the community', ru: 'Поделитесь красивым кодом с сообществом' },
  'add.titleLabel':       { en: 'Title *',                        ru: 'Название *' },
  'add.titlePlaceholder': { en: 'e.g., Fractal Tree',             ru: 'напр., Фрактальное дерево' },
  'add.langLabel':        { en: 'Language *',                     ru: 'Язык *' },
  'add.catLabel':         { en: 'Category *',                     ru: 'Категория *' },
  'add.selectPlaceholder':{ en: 'Select...',                      ru: 'Выбрать...' },
  'add.authorLabel':      { en: 'Author *',                       ru: 'Автор *' },
  'add.authorPlaceholder':{ en: 'e.g., CodeArtist',                ru: 'напр., Кодер' },
  'add.descLabel':        { en: 'Description',                    ru: 'Описание' },
  'add.descPlaceholder':  { en: 'Describe what makes this code beautiful...', ru: 'Опишите, чем этот код красив...' },
  'add.codeLabel':        { en: 'Code *',                         ru: 'Код *' },
  'add.codePlaceholder':  { en: 'Paste your beautiful code here...', ru: 'Вставьте свой код сюда...' },
  'add.cancel':           { en: 'Cancel',                         ru: 'Отмена' },
  'add.submit':           { en: 'Add Snippet',                    ru: 'Добавить' },
  'add.submitting':       { en: 'Adding...',                      ru: 'Добавление...' },

  // ============================================================
  //  FOOTER
  // ============================================================
  'footer.builtWith':     { en: 'Built with Next.js, Tailwind CSS & shadcn/ui', ru: 'Создано на Next.js, Tailwind CSS и shadcn/ui' },

  // ============================================================
  //  EMPTY STATE
  // ============================================================
  'empty.title':          { en: 'No snippets found',              ru: 'Сниппеты не найдены' },
  'empty.desc':           { en: 'Try adjusting your filters or search query to discover beautiful code.', ru: 'Попробуйте изменить фильтры или поисковый запрос.' },

  // ============================================================
  //  TOASTS
  // ============================================================
  'toast.error':          { en: 'Error',         ru: 'Ошибка' },
  'toast.success':        { en: 'Success',       ru: 'Успешно' },
  'toast.deleted':        { en: 'Deleted',       ru: 'Удалено' },
  'toast.deleteSuccess':  { en: 'Snippet deleted successfully',  ru: 'Сниппет успешно удалён' },
  'toast.addSuccess':     { en: 'Snippet added successfully!',   ru: 'Сниппет успешно добавлен!' },
  'toast.likeFailed':     { en: 'Failed to like snippet',        ru: 'Не удалось поставить лайк' },
  'toast.deleteFailed':   { en: 'Failed to delete snippet',      ru: 'Не удалось удалить сниппет' },
  'toast.addFailed':      { en: 'Failed to add snippet',         ru: 'Не удалось добавить сниппет' },
} as const;

export type DictKey = keyof typeof dict;

export function t(key: DictKey, locale: Locale): string {
  return dict[key][locale];
}

/** Get translated category name */
export function tCategory(cat: string, locale: Locale): string {
  if (cat === 'All') return t('filter.all', locale);
  const map: Record<string, DictKey> = {
    'Generative Art':        'cat.generativeArt',
    'Algorithms':             'cat.algorithms',
    'Shaders':                'cat.shaders',
    'Data Visualization':     'cat.dataViz',
    'Creative Coding':        'cat.creativeCoding',
    'Interactive':            'cat.interactive',
    'UI/UX':                  'cat.uiux',
  };
  const key = map[cat];
  return key ? t(key, locale) : cat;
}
