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
      // Get results with course information
      const [results] = await connection.execute(
        `SELECT 
          r.*,
          c.course_name,
          c.course_code,
          c.credit_units
         FROM results r
         JOIN courses c ON r.course_id = c.id
         WHERE r.student_id = ? AND r.is_released = TRUE
         ORDER BY r.academic_year DESC, r.semester DESC`,
        [session.user_id]
      );

      // Calculate cumulative GPA
      let totalPoints = 0;
      let totalUnits = 0;

      (results as any).forEach((result: any) => {
        if (result.gpa_points && result.credit_units) {
          totalPoints += result.gpa_points * result.credit_units;
          totalUnits += result.credit_units;
        }
      });

      const cumulativeGPA = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : '0.00';

      return NextResponse.json({
        results,
        cumulativeGPA,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get results error:', error);
    return NextResponse.json({ error: 'Failed to get results' }, { status: 500 });
  }
}
