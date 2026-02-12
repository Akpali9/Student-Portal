import crypto from 'crypto';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Hash password using SHA-256 (in production, use bcrypt)
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Verify password
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Generate a random session token
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Get database connection
export async function getConnection() {
  return await pool.getConnection();
}

// Find user by email
export async function findUserByEmail(email: string) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows && (rows as any)[0] ? (rows as any)[0] : null;
  } finally {
    connection.release();
  }
}

// Find user by ID
export async function findUserById(id: number) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows && (rows as any)[0] ? (rows as any)[0] : null;
  } finally {
    connection.release();
  }
}

// Create a new user
export async function createUser(userData: {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role?: string;
  oauth_provider?: string;
  oauth_id?: string;
}) {
  const connection = await getConnection();
  try {
    const [result] = await connection.execute(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, role, oauth_provider, oauth_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userData.email,
        userData.password_hash,
        userData.first_name,
        userData.last_name,
        userData.phone || null,
        userData.role || 'student',
        userData.oauth_provider || null,
        userData.oauth_id || null,
      ]
    );
    return (result as any).insertId;
  } finally {
    connection.release();
  }
}

// Create a session
export async function createSession(userId: number) {
  const connection = await getConnection();
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  try {
    await connection.execute(
      'INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)',
      [token, userId, token, expiresAt]
    );
    return token;
  } finally {
    connection.release();
  }
}

// Get session by token
export async function getSession(token: string) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM sessions WHERE token = ? AND expires_at > NOW()',
      [token]
    );
    return rows && (rows as any)[0] ? (rows as any)[0] : null;
  } finally {
    connection.release();
  }
}

// Delete session
export async function deleteSession(token: string) {
  const connection = await getConnection();
  try {
    await connection.execute(
      'DELETE FROM sessions WHERE token = ?',
      [token]
    );
  } finally {
    connection.release();
  }
}

// Create or get student profile
export async function createStudentProfile(userId: number, registrationNumber: string) {
  const connection = await getConnection();
  try {
    const [existing] = await connection.execute(
      'SELECT * FROM student_profiles WHERE user_id = ?',
      [userId]
    );
    
    if (existing && (existing as any).length > 0) {
      return (existing as any)[0];
    }

    const [result] = await connection.execute(
      'INSERT INTO student_profiles (user_id, registration_number) VALUES (?, ?)',
      [userId, registrationNumber]
    );
    return { id: (result as any).insertId, user_id: userId, registration_number: registrationNumber };
  } finally {
    connection.release();
  }
}

// Get student profile
export async function getStudentProfile(userId: number) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM student_profiles WHERE user_id = ?',
      [userId]
    );
    return rows && (rows as any)[0] ? (rows as any)[0] : null;
  } finally {
    connection.release();
  }
}
