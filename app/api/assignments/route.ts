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
      // Get student's courses first
      const [courses] = await connection.execute(
        'SELECT course_id FROM course_registrations WHERE student_id = ? AND status = "registered"',
        [session.user_id]
      );

      const courseIds = (courses as any).map((c: any) => c.course_id);
      
      if (courseIds.length === 0) {
        return NextResponse.json({ assignments: [], submissions: [] });
      }

      const placeholders = courseIds.map(() => '?').join(',');

      // Get assignments for student's courses
      const [assignments] = await connection.execute(
        `SELECT a.*, c.course_name 
         FROM assignments a 
         JOIN courses c ON a.course_id = c.id 
         WHERE a.course_id IN (${placeholders})
         ORDER BY a.due_date ASC`,
        courseIds
      );

      // Get student's submissions
      const [submissions] = await connection.execute(
        `SELECT 
          asus.*, 
          a.title, 
          c.course_name
         FROM assignment_submissions asus 
         JOIN assignments a ON asus.assignment_id = a.id 
         JOIN courses c ON a.course_id = c.id 
         WHERE asus.student_id = ?
         ORDER BY asus.submitted_at DESC`,
        [session.user_id]
      );

      return NextResponse.json({ assignments, submissions });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get assignments error:', error);
    return NextResponse.json({ error: 'Failed to get assignments' }, { status: 500 });
  }
}
