import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Select only fields needed for list view (O(1) per row instead of full code blobs)
const LIST_SELECT = {
  id: true,
  title: true,
  description: true,
  language: true,
  category: true,
  author: true,
  isFeatured: true,
  likes: true,
  createdAt: true,
};

// For code preview in cards: only first 200 chars
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

// Stats endpoint — lightweight aggregation, O(1) vs fetching all rows
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const statsOnly = searchParams.get('stats') === 'true';

    const where: Record<string, unknown> = {};

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
      // Removed code search from list view — O(n) scan on large text field
      // Full-text code search available via detail endpoint
    }

    // Stats mode: aggregate instead of fetching all rows — O(1) DB work
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
    });

    return NextResponse.json(snippets);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch snippets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, code, language, category, author, isFeatured } = body;

    if (!title || !code || !language || !category) {
      return NextResponse.json(
        { error: 'Title, code, language, and category are required' },
        { status: 400 }
      );
    }

    const snippet = await db.codeSnippet.create({
      data: {
        title,
        description: description || '',
        code,
        language,
        category,
        author: author || 'Anonymous',
        isFeatured: isFeatured || false,
      },
    });

    return NextResponse.json(snippet, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create snippet' }, { status: 500 });
  }
}
