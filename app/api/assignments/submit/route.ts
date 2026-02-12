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

    const { assignmentId, submissionText } = await request.json();

    if (!assignmentId || !submissionText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const connection = await getConnection();

    try {
      await connection.execute(
        `INSERT INTO assignment_submissions 
         (assignment_id, student_id, submission_text, status) 
         VALUES (?, ?, ?, 'submitted')`,
        [assignmentId, session.user_id, submissionText]
      );

      return NextResponse.json(
        { success: true, message: 'Assignment submitted successfully' },
        { status: 201 }
      );
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json(
          { error: 'You have already submitted this assignment' },
          { status: 409 }
        );
      }
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Submit assignment error:', error);
    return NextResponse.json({ error: 'Failed to submit assignment' }, { status: 500 });
  }
}
