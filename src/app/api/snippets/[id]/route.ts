import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { validateApiKey } from '@/lib/api-auth';

// Rate limit: 30 delete requests per minute per IP
const DELETE_LIMIT = 30;
const DELETE_WINDOW_MS = 60_000;

// Rate limit: 60 read requests per minute per IP
const READ_LIMIT = 60;
const READ_WINDOW_MS = 60_000;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (rateLimit(ip + ':read', READ_LIMIT, READ_WINDOW_MS)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { id } = await params;
    const snippet = await db.codeSnippet.findUnique({
      where: { id },
    });

    if (!snippet) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }

    return NextResponse.json(snippet);
  } catch (error) {
    console.error('[GET /api/snippets/:id]', error);
    return NextResponse.json({ error: 'Failed to fetch snippet' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (rateLimit(ip + ':delete', DELETE_LIMIT, DELETE_WINDOW_MS)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { id } = await params;

    // Check existence first to return proper 404
    const existing = await db.codeSnippet.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }

    await db.codeSnippet.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/snippets/:id]', error);
    return NextResponse.json({ error: 'Failed to delete snippet' }, { status: 500 });
  }
}
