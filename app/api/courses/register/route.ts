import { NextRequest, NextResponse } from 'next/server';
import { getConnection, getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const session = await getSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const connection = await getConnection();

    try {
      await connection.execute(
        'INSERT INTO course_registrations (student_id, course_id, status) VALUES (?, ?, "registered")',
        [session.user_id, courseId]
      );

      return NextResponse.json(
        { success: true, message: 'Course registered successfully' },
        { status: 201 }
      );
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json(
          { error: 'Already registered for this course' },
          { status: 409 }
        );
      }
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Register course error:', error);
    return NextResponse.json({ error: 'Failed to register course' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('session_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const session = await getSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const connection = await getConnection();

    try {
      await connection.execute(
        'DELETE FROM course_registrations WHERE student_id = ? AND course_id = ?',
        [session.user_id, courseId]
      );

      return NextResponse.json({ success: true, message: 'Course dropped successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Drop course error:', error);
    return NextResponse.json({ error: 'Failed to drop course' }, { status: 500 });
  }
}
