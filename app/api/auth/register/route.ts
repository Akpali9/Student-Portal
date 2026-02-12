import { NextRequest, NextResponse } from 'next/server';
import { createUser, hashPassword, createSession, createStudentProfile, findUserByEmail } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, registrationNumber } = body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create user
    const passwordHash = hashPassword(password);
    const userId = await createUser({
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone: phone || undefined,
      role: 'student',
    });

    // Create student profile with registration number
    if (registrationNumber) {
      await createStudentProfile(userId, registrationNumber);
    }

    // Create session
    const token = await createSession(userId);

    // Set session cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: userId,
          email,
          firstName,
          lastName,
          role: 'student',
        },
      },
      { status: 201 }
    );

    response.cookies.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
