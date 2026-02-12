import { NextRequest, NextResponse } from 'next/server';
import { getConnection, getSession, findUserById } from '@/lib/auth';

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
    
    // Get all available courses
    const [courses] = await connection.execute(
      'SELECT c.*, u.first_name, u.last_name FROM courses c LEFT JOIN users u ON c.instructor_id = u.id ORDER BY c.course_name'
    );

    // Get student's registered courses
    const [registered] = await connection.execute(
      'SELECT course_id FROM course_registrations WHERE student_id = ? AND status = "registered"',
      [session.user_id]
    );

    connection.release();

    const registeredIds = (registered as any).map((r: any) => r.course_id);

    return NextResponse.json({
      courses: courses,
      registeredCourses: registeredIds,
    });
  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json({ error: 'Failed to get courses' }, { status: 500 });
  }
}
