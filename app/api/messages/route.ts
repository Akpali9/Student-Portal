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
      // Get unread messages
      const [unreadMessages] = await connection.execute(
        `SELECT m.*, 
          u.first_name as sender_first_name, 
          u.last_name as sender_last_name 
         FROM messages m 
         JOIN users u ON m.sender_id = u.id 
         WHERE m.recipient_id = ? AND m.is_read = FALSE 
         ORDER BY m.created_at DESC`,
        [session.user_id]
      );

      // Get all messages (sent and received)
      const [allMessages] = await connection.execute(
        `SELECT m.*, 
          u_sender.first_name as sender_first_name, 
          u_sender.last_name as sender_last_name,
          u_recipient.first_name as recipient_first_name,
          u_recipient.last_name as recipient_last_name
         FROM messages m 
         JOIN users u_sender ON m.sender_id = u_sender.id 
         JOIN users u_recipient ON m.recipient_id = u_recipient.id 
         WHERE m.sender_id = ? OR m.recipient_id = ?
         ORDER BY m.created_at DESC 
         LIMIT 50`,
        [session.user_id, session.user_id]
      );

      return NextResponse.json({
        unreadMessages,
        allMessages,
        unreadCount: (unreadMessages as any).length,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: 'Failed to get messages' }, { status: 500 });
  }
}

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

    const { recipientId, subject, message } = await request.json();

    if (!recipientId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const connection = await getConnection();

    try {
      await connection.execute(
        `INSERT INTO messages 
         (sender_id, recipient_id, subject, message_text, message_type) 
         VALUES (?, ?, ?, ?, 'direct')`,
        [session.user_id, recipientId, subject || null, message]
      );

      return NextResponse.json(
        { success: true, message: 'Message sent successfully' },
        { status: 201 }
      );
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
