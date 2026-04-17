import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

// Rate limit: 30 like requests per minute per IP
const LIKE_LIMIT = 30;
const LIKE_WINDOW_MS = 60_000;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (rateLimit(ip + ':like', LIKE_LIMIT, LIKE_WINDOW_MS)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { id } = await params;

    const existing = await db.codeSnippet.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }

    const snippet = await db.codeSnippet.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });

    return NextResponse.json({ likes: snippet.likes });
  } catch (error) {
    console.error('[POST /api/snippets/:id/like]', error);
    return NextResponse.json({ error: 'Failed to like snippet' }, { status: 500 });
  }
}
