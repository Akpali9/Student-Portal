import { NextRequest, NextResponse } from 'next/server';
import { getConnection, getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const session = await getSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const connection = await getConnection();

    try {
      const [news] = await connection.execute(
        `SELECT n.*, u.first_name, u.last_name 
         FROM news n 
         LEFT JOIN users u ON n.author_id = u.id 
         WHERE n.is_published = TRUE 
         ORDER BY n.published_date DESC 
         LIMIT 20`
      );

      return NextResponse.json({ news });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get news error:', error);
    return NextResponse.json({ error: 'Failed to get news' }, { status: 500 });
  }
}
