# Student Portal - Setup Guide

## Overview

This is a complete student portal system built with Next.js, providing comprehensive academic management features for students, including course registration, payment tracking, grades, assignments, and communication.

## Features

- **User Authentication**: Email/password registration and login with OAuth support
- **Course Management**: Register for courses, view course details, drop courses
- **Payment System**: Track school fees, process payments, manage scratch cards
- **Results & Grades**: View academic results, calculate GPA, track performance
- **News & Updates**: Read school announcements and updates
- **Assignments**: Submit assignments, track submissions, receive feedback
- **E-Books**: Download course materials and study resources
- **Direct Messaging**: Communicate with school management
- **Class Directory**: Connect with classmates, view registration numbers
- **Dashboard**: Quick overview of academic status and pending tasks

## Prerequisites

- Node.js 18+ installed
- MySQL database (local or remote)
- npm or pnpm package manager

## Installation

### 1. Database Setup

First, create a MySQL database and run the migration script:

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE student_portal;"

# Run migration
mysql -u root -p student_portal < scripts/init-db.sql
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_portal

# Application
NODE_ENV=development
```

### 3. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 4. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## Database Schema

The database includes the following tables:

### Core Tables
- `users` - User authentication and profiles
- `student_profiles` - Extended student information
- `sessions` - Session management

### Academic Tables
- `courses` - Course catalog
- `course_registrations` - Student course enrollments
- `assignments` - Course assignments
- `assignment_submissions` - Student submissions
- `results` - Academic results and grades
- `ebooks` - Course study materials
- `ebook_downloads` - Download tracking

### Administrative Tables
- `school_fees` - Fee tracking
- `payments` - Payment records
- `scratch_cards` - Scratch card inventory
- `news` - School announcements
- `messages` - Communication records
- `class_enrollments` - Class groupings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - List courses
- `POST /api/courses/register` - Register for course
- `DELETE /api/courses/register?courseId=X` - Drop course

### Payments
- `GET /api/payments` - Get fees and history
- `POST /api/payments/process` - Process payment/scratch card

### Academic
- `GET /api/results` - Get grades and results
- `GET /api/assignments` - Get assignments
- `POST /api/assignments/submit` - Submit assignment
- `GET /api/ebooks` - Get course ebooks

### Communication
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message
- `GET /api/news` - Get news updates
- `GET /api/directory` - Get class directory

## File Structure

```
app/
  ├── (auth)/
  │   ├── login/
  │   └── register/
  ├── dashboard/
  │   ├── page.tsx
  │   ├── courses/
  │   ├── payments/
  │   ├── results/
  │   ├── assignments/
  │   ├── ebooks/
  │   ├── messages/
  │   ├── news/
  │   ├── directory/
  │   ├── layout.tsx
  │   └── profile/
  ├── api/
  │   ├── auth/
  │   ├── courses/
  │   ├── payments/
  │   ├── results/
  │   ├── assignments/
  │   ├── ebooks/
  │   ├── messages/
  │   ├── news/
  │   └── directory/
  ├── layout.tsx
  ├── page.tsx
  └── globals.css
components/
  ├── dashboard/
  │   ├── Sidebar.tsx
  │   └── TopNav.tsx
  └── ui/
lib/
  └── auth.ts
scripts/
  └── init-db.sql
```

## Testing the Application

### 1. Create Test User
```bash
# Register at http://localhost:3000/register
# Example:
# Email: student@example.com
# Password: Test@123
# Registration Number: STU-2024-001
```

### 2. Add Test Data

Create test data in MySQL:

```sql
-- Add sample course
INSERT INTO courses (course_code, course_name, description, credit_units, semester, academic_year)
VALUES ('CS101', 'Introduction to Programming', 'Learn programming basics', 3, 1, '2024/2025');

-- Add sample fees
INSERT INTO school_fees (student_id, academic_year, semester, amount, description, due_date, payment_status)
VALUES (1, '2024/2025', 1, 500.00, 'Tuition Fee', '2024-02-28', 'pending');

-- Add sample news
INSERT INTO news (title, content, category, is_published, published_date)
VALUES ('School Closure', 'School will be closed on holidays', 'Admin', TRUE, NOW());
```

## User Roles

### Student
- Register for courses
- Submit assignments
- View grades and results
- Make payments
- Download e-books
- Send messages to management
- View classmates

### Admin
- Manage courses
- Add results
- Create news
- Process payments
- Manage scratch cards
- Send messages to students

## Security Considerations

1. **Password Security**: Passwords are hashed using SHA-256 (upgrade to bcrypt in production)
2. **Session Management**: HTTP-only cookies with 30-day expiration
3. **Input Validation**: All inputs are validated before database operations
4. **SQL Injection Prevention**: Using parameterized queries

## Production Deployment

Before deploying to production:

1. Upgrade password hashing to bcrypt
2. Set up proper environment variables
3. Enable HTTPS
4. Configure database backup strategy
5. Implement rate limiting
6. Add comprehensive logging
7. Set up error monitoring (Sentry)
8. Enable CORS properly
9. Implement proper error handling
10. Add integration tests

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check database credentials in `.env.local`
- Ensure database and tables are created

### Authentication Issues
- Clear browser cookies
- Verify session token in cookies
- Check database sessions table

### Payment Processing Issues
- Verify scratch card exists and is not used
- Check payment reference in database
- Review payment logs

## Future Enhancements

- Real OAuth integration with Google/GitHub
- Advanced payment processor integration
- Email notifications
- SMS alerts
- Mobile app
- Admin dashboard
- Analytics and reporting
- Calendar integration
- Resource booking system
- Document management

## Support

For issues or questions, please contact the development team or check the documentation.

## License

This project is licensed under the MIT License.
