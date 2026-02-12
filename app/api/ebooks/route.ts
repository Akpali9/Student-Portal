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
      // Get student's courses
      const [courses] = await connection.execute(
        'SELECT course_id FROM course_registrations WHERE student_id = ? AND status = "registered"',
        [session.user_id]
      );

      const courseIds = (courses as any).map((c: any) => c.course_id);

      if (courseIds.length === 0) {
        return NextResponse.json({ ebooks: [] });
      }

      const placeholders = courseIds.map(() => '?').join(',');

      // Get ebooks for registered courses
      const [ebooks] = await connection.execute(
        `SELECT e.*, c.course_name,
          (SELECT COUNT(*) FROM ebook_downloads 
           WHERE ebook_id = e.id AND student_id = ?) as is_downloaded
         FROM ebooks e 
         JOIN courses c ON e.course_id = c.id 
         WHERE e.course_id IN (${placeholders}) AND e.is_available = TRUE
         ORDER BY c.course_name, e.title`,
        [session.user_id, ...courseIds]
      );

      return NextResponse.json({ ebooks });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get ebooks error:', error);
    return NextResponse.json({ error: 'Failed to get ebooks' }, { status: 500 });
  }
}
