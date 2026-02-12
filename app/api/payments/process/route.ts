import { NextRequest, NextResponse } from 'next/server';
import { getConnection, getSession } from '@/lib/auth';
import crypto from 'crypto';

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

    const { amount, paymentType, description, schoolFeeId, scratchCardNumber, scratchCardPin } = 
      await request.json();

    if (!amount || !paymentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const connection = await getConnection();

    try {
      const referenceNumber = `REF-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

      if (paymentType === 'scratch_card') {
        // Validate and use scratch card
        const [card] = await connection.execute(
          'SELECT * FROM scratch_cards WHERE card_number = ? AND pin_code = ?',
          [scratchCardNumber, scratchCardPin]
        );

        if (!card || !(card as any).length) {
          return NextResponse.json(
            { error: 'Invalid scratch card details' },
            { status: 400 }
          );
        }

        const scratchCard = (card as any)[0];

        if (scratchCard.is_used) {
          return NextResponse.json(
            { error: 'Scratch card has already been used' },
            { status: 400 }
          );
        }

        // Update scratch card as used
        await connection.execute(
          'UPDATE scratch_cards SET is_used = TRUE, used_by = ?, used_date = NOW() WHERE id = ?',
          [session.user_id, scratchCard.id]
        );

        // Create payment record
        await connection.execute(
          `INSERT INTO payments 
           (student_id, amount, payment_type, description, reference_number, payment_method, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            session.user_id,
            scratchCard.denomination,
            'scratch_card',
            description || 'Scratch Card Payment',
            referenceNumber,
            'scratch_card',
            'completed',
          ]
        );
      } else if (paymentType === 'school_fees') {
        // Create pending payment for school fees
        await connection.execute(
          `INSERT INTO payments 
           (student_id, school_fee_id, amount, payment_type, description, reference_number, payment_method, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            session.user_id,
            schoolFeeId || null,
            amount,
            'school_fees',
            description || 'School Fees Payment',
            referenceNumber,
            'manual',
            'pending',
          ]
        );
      } else {
        return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 });
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Payment processed successfully',
          referenceNumber,
        },
        { status: 201 }
      );
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}
