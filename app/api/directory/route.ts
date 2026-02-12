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
      // Get current student's class enrollments
      const [studentClass] = await connection.execute(
        `SELECT class_name, academic_year, semester 
         FROM class_enrollments 
         WHERE student_id = ? 
         ORDER BY academic_year DESC, semester DESC 
         LIMIT 1`,
        [session.user_id]
      );

      if (!studentClass || !(studentClass as any).length) {
        return NextResponse.json({
          classmates: [],
          currentClass: null,
        });
      }

      const { class_name, academic_year, semester } = (studentClass as any)[0];

      // Get all students in the same class
      const [classmates] = await connection.execute(
        `SELECT 
          u.id,
          u.email,
          u.first_name,
          u.last_name,
          sp.registration_number,
          sp.profile_photo_url,
          ce.class_name
         FROM class_enrollments ce
         JOIN users u ON ce.student_id = u.id
         LEFT JOIN student_profiles sp ON u.id = sp.user_id
         WHERE ce.class_name = ? 
         AND ce.academic_year = ? 
         AND ce.semester = ?
         AND u.id != ?
         ORDER BY u.first_name, u.last_name`,
        [class_name, academic_year, semester, session.user_id]
      );

      return NextResponse.json({
        classmates,
        currentClass: {
          name: class_name,
          academicYear: academic_year,
          semester,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get directory error:', error);
    return NextResponse.json({ error: 'Failed to get directory' }, { status: 500 });
  }
}
