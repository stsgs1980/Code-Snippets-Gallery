import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

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
        { code: { contains: search } },
      ];
    }

    const snippets = await db.codeSnippet.findMany({
      where,
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
