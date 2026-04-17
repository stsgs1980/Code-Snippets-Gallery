# Code Snippets Gallery

A curated gallery of beautiful code snippets with live interactive previews - algorithms, shaders, generative art, and creative coding masterpieces rendered in real-time sandboxed iframes.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Bun](https://img.shields.io/badge/Bun-Latest-FBF009?style=flat-square&logo=bun)

## Features

- Live interactive previews - every snippet renders in a sandboxed iframe with real Canvas 2D, WebGL shaders, and CSS animations
- i18n support - full English / Russian interface with browser language auto-detection and localStorage persistence
- Dark / Light / System theme - automatic theme switching via next-themes
- Advanced filtering - search by text, filter by language (7 languages) and category (7 categories)
- Snippet management - create, view, copy, like, and delete code snippets with optimistic UI updates
- Responsive design - mobile-first layout with breakpoints for all screen sizes
- Framer Motion animations - smooth card hover, page transitions, and staggered grid loading
- Accessible UI - semantic HTML, ARIA labels, keyboard navigation, screen reader support
- Toast notifications - user feedback for all actions (add, delete, copy, like errors)
- Code dialog - full-screen modal with Preview / Code tabs, syntax-highlighted line numbers, copy button, and delete confirmation

## Tech Stack

- **Framework** - Next.js 16 with App Router and Turbopack
- **Language** - TypeScript 5 with strict mode
- **Styling** - Tailwind CSS 4 with OKLCH color system and shadcn/ui component library (45+ Radix primitives)
- **Database** - Prisma 6 ORM with SQLite
- **State** - TanStack Query 5 for server state, Zustand 5 for client state
- **Animation** - Framer Motion 12
- **Theming** - next-themes with CSS custom properties
- **Validation** - Zod 4 schema validation
- **Icons** - Lucide React
- **Fonts** - Geist Sans + Geist Mono via next/font
- **Runtime** - Bun

## Getting Started

### Prerequisites

- Bun (latest) or Node.js 18+
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd my-project

# Install dependencies
bun install

# Setup database
bun run db:push

# Seed sample snippets (12 curated snippets across 7 languages)
bun run prisma db seed

# Run development server
bun run dev
```

Open the preview panel to see the application running.

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server on port 3000 |
| `bun run build` | Production build with standalone output |
| `bun run start` | Run production server |
| `bun run lint` | Run ESLint code quality check |
| `bun run db:push` | Push Prisma schema to SQLite database |
| `bun run db:generate` | Generate Prisma Client |
| `bun run db:migrate` | Run database migrations |
| `bun run db:reset` | Reset database to clean state |

## Project Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/app/api/snippets/` - REST API endpoints for snippet CRUD and likes
- `src/components/` - React UI components (Header, HeroSection, FilterBar, SnippetCard, CodeDialog, AddSnippetDialog, Footer)
- `src/components/ui/` - shadcn/ui primitives (45+ components)
- `src/components/snippet-preview.tsx` - Sandboxed iframe renderer with srcdoc injection
- `src/hooks/` - Custom React hooks (useLocale for i18n, useMobile, useToast)
- `src/lib/i18n.ts` - Translation dictionaries (EN/RU) with type-safe dictionary keys
- `src/lib/preview-renderer.ts` - Preview HTML generators for Canvas 2D, WebGL, and CSS animations
- `src/lib/db.ts` - Prisma Client singleton
- `src/lib/utils.ts` - Utility functions (cn helper)
- `prisma/schema.prisma` - Database schema definition
- `prisma/seed.ts` - Database seeder with 12 curated code snippets

## API Reference

### Snippets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/snippets` | List all snippets with optional filtering |
| POST | `/api/snippets` | Create a new snippet |
| GET | `/api/snippets/[id]` | Get a single snippet by ID |
| DELETE | `/api/snippets/[id]` | Delete a snippet by ID |
| POST | `/api/snippets/[id]/like` | Increment snippet likes by 1 |

### Query Parameters (GET /api/snippets)

| Parameter | Type | Description |
|-----------|------|-------------|
| `language` | string | Filter by programming language |
| `category` | string | Filter by category |
| `search` | string | Search in title, description, and author |
| `featured` | string | Set to `true` to show only featured snippets |
| `stats` | string | Set to `true` to get aggregate statistics |

### Snippet Schema

```typescript
interface CodeSnippet {
  id: string;          // CUID primary key
  title: string;       // Snippet title (max 100 chars)
  description: string; // Description text
  code: string;        // Full source code
  language: string;    // JavaScript, Python, GLSL, Rust, Haskell, CSS, TypeScript
  category: string;    // Generative Art, Algorithms, Shaders, etc.
  author: string;      // Author name (default: Anonymous)
  isFeatured: boolean; // Featured badge (default: false)
  likes: number;       // Like count (default: 0)
  createdAt: string;   // ISO timestamp
  updatedAt: string;   // ISO timestamp
}
```

## Configuration

### Environment Variables

No environment variables required for development. The database URL defaults to SQLite file storage:

```env
DATABASE_URL="file:./db/dev.db"
```

### Preview Rendering

All code previews are rendered in sandboxed iframes using the `srcdoc` attribute with the following security settings:

- `sandbox="allow-scripts allow-same-origin"` - Required for WebGL context creation
- No blob URLs used - prevents cross-origin policy blocking in sandboxed environments
- HTML is cached per snippet to avoid re-generation on re-renders

## Development Rules

### Required Technologies

- Next.js 16 with App Router (server components, API routes)
- TypeScript throughout with strict typing
- Tailwind CSS 4 with shadcn/ui components
- Prisma ORM with SQLite

### Code Style

- Use existing shadcn/ui components instead of building from scratch
- ES6+ import/export syntax with `use client` / `use server` directives
- Responsive design with mobile-first approach
- Framer Motion for all animations
- `suppressHydrationWarning` on locale-dependent text nodes (SSR/client hydration)
- `useSyncExternalStore` for client-side persisted state (avoids React 19 lint errors)

---

Built with: Next.js 16 + TypeScript + Tailwind CSS
