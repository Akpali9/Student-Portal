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
      // Get school fees
      const [fees] = await connection.execute(
        'SELECT * FROM school_fees WHERE student_id = ? ORDER BY due_date DESC',
        [session.user_id]
      );

      // Get payment history
      const [payments] = await connection.execute(
        `SELECT p.*, sf.description as fee_description 
         FROM payments p 
         LEFT JOIN school_fees sf ON p.school_fee_id = sf.id 
         WHERE p.student_id = ? 
         ORDER BY p.payment_date DESC 
         LIMIT 20`,
        [session.user_id]
      );

      return NextResponse.json({
        fees,
        paymentHistory: payments,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json({ error: 'Failed to get payments' }, { status: 500 });
  }
}
