import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { rateLimit } from '@/lib/rate-limit';
import { validateApiKey } from '@/lib/api-auth';

// Rate limit: 20 create requests per minute per IP
const CREATE_LIMIT = 20;
const CREATE_WINDOW_MS = 60_000;

// Rate limit: 60 read requests per minute per IP
const READ_LIMIT = 60;
const READ_WINDOW_MS = 60_000;

const CARD_SELECT = {
  id: true,
  title: true,
  description: true,
  language: true,
  category: true,
  author: true,
  isFeatured: true,
  likes: true,
  createdAt: true,
  code: true,
};

const createSnippetSchema = z.object({
  title: z.string().min(1).max(100),
  code: z.string().min(10).max(50_000),
  language: z.enum(['JavaScript', 'Python', 'GLSL', 'Rust', 'Haskell', 'CSS', 'TypeScript']),
  category: z.enum([
    'Generative Art',
    'Algorithms',
    'Shaders',
    'Data Visualization',
    'Creative Coding',
    'Interactive',
    'UI/UX',
  ]),
  author: z.string().min(1).max(50).optional(),
  description: z.string().max(500).optional(),
});

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (rateLimit(ip + ':read', READ_LIMIT, READ_WINDOW_MS)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 50, 100) : 50;
    const statsOnly = searchParams.get('stats') === 'true';

    const where: Prisma.CodeSnippetWhereInput = {};

    if (language && language !== 'All') {
      where.language = language;
    }
    if (category && category !== 'All') {
      where.category = category;
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { author: { contains: search } },
      ];
    }

    // Stats mode: aggregate instead of fetching all rows
    if (statsOnly) {
      const [total, languages, categories] = await Promise.all([
        db.codeSnippet.count({ where }),
        db.codeSnippet.groupBy({ by: ['language'], where, _count: true }),
        db.codeSnippet.groupBy({ by: ['category'], where, _count: true }),
      ]);
      return NextResponse.json({
        total,
        languages: languages.map(l => l.language),
        categories: categories.map(c => c.category),
      });
    }

    const snippets = await db.codeSnippet.findMany({
      where,
      select: CARD_SELECT,
      orderBy: [
        { isFeatured: 'desc' },
        { likes: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });

    return NextResponse.json(snippets);
  } catch (error) {
    console.error('[GET /api/snippets]', error);
    return NextResponse.json({ error: 'Failed to fetch snippets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (rateLimit(ip + ':create', CREATE_LIMIT, CREATE_WINDOW_MS)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const result = createSnippetSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.issues },
        { status: 400 }
      );
    }

    const { title, description, code, language, category, author } = result.data;

    // isFeatured is NEVER accepted from user input - only settable via seed/admin
    const snippet = await db.codeSnippet.create({
      data: {
        title,
        description: description || '',
        code,
        language,
        category,
        author: author || 'Anonymous',
        isFeatured: false,
      },
    });

    return NextResponse.json(snippet, { status: 201 });
  } catch (error) {
    console.error('[POST /api/snippets]', error);
    return NextResponse.json({ error: 'Failed to create snippet' }, { status: 500 });
  }
}
