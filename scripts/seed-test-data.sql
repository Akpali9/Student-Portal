-- Test Data for Student Portal

-- Sample Users (Passwords: password123 hashed)
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('admin@school.edu', 'cd8c2e8c4d8c4a5f5f5f5f5f5f5f5f5f', 'Admin', 'User', '+1234567890', 'admin'),
('teacher1@school.edu', 'cd8c2e8c4d8c4a5f5f5f5f5f5f5f5f5f', 'John', 'Smith', '+1234567891', 'teacher'),
('student1@example.com', 'cd8c2e8c4d8c4a5f5f5f5f5f5f5f5f5f', 'Alice', 'Johnson', '+1234567892', 'student'),
('student2@example.com', 'cd8c2e8c4d8c4a5f5f5f5f5f5f5f5f5f', 'Bob', 'Williams', '+1234567893', 'student'),
('student3@example.com', 'cd8c2e8c4d8c4a5f5f5f5f5f5f5f5f5f', 'Charlie', 'Brown', '+1234567894', 'student'),
('student4@example.com', 'cd8c2e8c4d8c4a5f5f5f5f5f5f5f5f5f', 'Diana', 'Davis', '+1234567895', 'student');

-- Sample Student Profiles
INSERT INTO student_profiles (user_id, registration_number, matriculation_number, gender) VALUES
(3, 'STU-2024-001', 'MAT-2024-001', 'F'),
(4, 'STU-2024-002', 'MAT-2024-002', 'M'),
(5, 'STU-2024-003', 'MAT-2024-003', 'M'),
(6, 'STU-2024-004', 'MAT-2024-004', 'F');

-- Sample Courses
INSERT INTO courses (course_code, course_name, description, credit_units, instructor_id, semester, academic_year) VALUES
('CS101', 'Introduction to Programming', 'Learn the fundamentals of programming with Python', 3, 2, 1, '2024/2025'),
('CS102', 'Data Structures', 'Master arrays, lists, trees, and graphs', 4, 2, 1, '2024/2025'),
('MATH101', 'Calculus I', 'Differential and integral calculus', 3, 2, 1, '2024/2025'),
('PHYS101', 'Physics I', 'Mechanics and thermodynamics', 4, 2, 1, '2024/2025'),
('ENG101', 'English Composition', 'Academic writing and communication', 3, 2, 1, '2024/2025'),
('CS201', 'Web Development', 'Building modern web applications', 3, 2, 2, '2024/2025');

-- Sample Course Registrations
INSERT INTO course_registrations (student_id, course_id, status, grade, score) VALUES
(3, 1, 'completed', 'A', 92),
(3, 2, 'completed', 'B+', 87),
(3, 3, 'registered', NULL, NULL),
(4, 1, 'completed', 'B', 82),
(4, 2, 'registered', NULL, NULL),
(5, 1, 'completed', 'A-', 89),
(5, 3, 'registered', NULL, NULL),
(6, 2, 'registered', NULL, NULL);

-- Sample School Fees
INSERT INTO school_fees (student_id, academic_year, semester, amount, description, due_date, paid_amount, payment_status) VALUES
(3, '2024/2025', 1, 2500.00, 'Tuition Fee - Semester 1', '2024-01-31', 2500.00, 'paid'),
(3, '2024/2025', 2, 2500.00, 'Tuition Fee - Semester 2', '2024-06-30', 0.00, 'pending'),
(4, '2024/2025', 1, 2500.00, 'Tuition Fee - Semester 1', '2024-01-31', 1250.00, 'partial'),
(5, '2024/2025', 1, 2500.00, 'Tuition Fee - Semester 1', '2024-01-31', 0.00, 'pending'),
(6, '2024/2025', 1, 2500.00, 'Tuition Fee - Semester 1', '2024-01-31', 2500.00, 'paid');

-- Sample Payments
INSERT INTO payments (student_id, school_fee_id, amount, payment_type, description, reference_number, payment_method, status) VALUES
(3, 1, 2500.00, 'school_fees', 'Full semester payment', 'REF-2024-001', 'scratch_card', 'completed'),
(4, 3, 1250.00, 'school_fees', 'Partial payment', 'REF-2024-002', 'scratch_card', 'completed'),
(6, 5, 2500.00, 'school_fees', 'Full semester payment', 'REF-2024-003', 'scratch_card', 'completed');

-- Sample Scratch Cards
INSERT INTO scratch_cards (card_number, pin_code, denomination, is_used, used_by, used_date) VALUES
('CARD-001-12345', 'PIN-001-XXXX', 2500.00, TRUE, 3, '2024-01-15'),
('CARD-001-12346', 'PIN-001-XXXX', 1250.00, TRUE, 4, '2024-01-20'),
('CARD-001-12347', 'PIN-001-XXXX', 2500.00, TRUE, 6, '2024-01-10'),
('CARD-001-12348', 'PIN-001-XXXX', 1000.00, FALSE, NULL, NULL),
('CARD-001-12349', 'PIN-001-XXXX', 500.00, FALSE, NULL, NULL);

-- Sample News
INSERT INTO news (title, content, image_url, author_id, published_date, is_published, category) VALUES
('School Reopens for New Semester', 'Classes resume on January 8, 2024. Please ensure all fees are paid before the first day.', NULL, 1, '2024-01-05', TRUE, 'Academic'),
('Library Extended Hours', 'The library will remain open until 10 PM during exam period to support student study sessions.', NULL, 1, '2024-01-03', TRUE, 'Facilities'),
('Student Achievement: Math Competition Winners', 'Congratulations to our students who won first place in the National Math Competition!', NULL, 1, '2024-01-02', TRUE, 'Achievement'),
('Holiday Break Announcement', 'The school will be closed from December 15 to January 7 for the holiday break.', NULL, 1, '2023-12-10', TRUE, 'Admin'),
('New Lab Equipment Installed', 'State-of-the-art computer lab equipment has been installed for enhanced learning.', NULL, 1, '2023-12-08', TRUE, 'Facilities');

-- Sample Assignments
INSERT INTO assignments (course_id, title, description, due_date, max_score, created_by) VALUES
(1, 'Python Basics Quiz', 'Complete the quiz on Python variables and data types', '2024-02-15 23:59:59', 100, 2),
(1, 'First Program Assignment', 'Write a program to calculate factorial of a number', '2024-02-22 23:59:59', 100, 2),
(2, 'Array Manipulation', 'Implement array operations and sorting', '2024-02-20 23:59:59', 100, 2),
(3, 'Calculus Problem Set', 'Solve 20 calculus problems from Chapter 5', '2024-02-18 23:59:59', 50, 2);

-- Sample Assignment Submissions
INSERT INTO assignment_submissions (assignment_id, student_id, submission_text, submitted_at, score, feedback, graded_at, graded_by, status) VALUES
(1, 3, 'My solution for the Python quiz...', '2024-02-14 15:30:00', 95, 'Excellent work! Great understanding of variables.', '2024-02-15 10:00:00', 2, 'graded'),
(2, 3, 'My factorial program...', '2024-02-21 22:45:00', 88, 'Good implementation. Could optimize further.', '2024-02-22 11:00:00', 2, 'graded'),
(1, 4, 'Python quiz submission...', '2024-02-15 20:15:00', 82, 'Good effort. Review the section on data types.', '2024-02-15 10:30:00', 2, 'graded'),
(3, 5, 'Array implementation...', '2024-02-19 18:20:00', NULL, NULL, NULL, NULL, 'submitted');

-- Sample E-Books
INSERT INTO ebooks (course_id, title, author, description, isbn, file_type, file_size, uploaded_by, is_available) VALUES
(1, 'Python Programming Guide', 'John Smith', 'Complete guide to Python programming', 'ISBN-001', 'pdf', 5242880, 2, TRUE),
(1, 'Python Cheat Sheet', 'Jane Doe', 'Quick reference for Python syntax', 'ISBN-002', 'pdf', 1048576, 2, TRUE),
(2, 'Data Structures in Depth', 'Robert Johnson', 'Advanced data structures and algorithms', 'ISBN-003', 'pdf', 8388608, 2, TRUE),
(3, 'Calculus Essentials', 'Marie Curie', 'Essential calculus concepts and problems', 'ISBN-004', 'pdf', 3145728, 2, TRUE);

-- Sample Messages
INSERT INTO messages (sender_id, recipient_id, subject, message_text, is_read, message_type) VALUES
(3, 1, 'Fee Payment Inquiry', 'I have a question about the payment deadline for semester 2.', FALSE, 'direct'),
(1, 3, 'Re: Fee Payment Inquiry', 'The deadline is June 30, 2024. Contact the finance office for extensions.', FALSE, 'direct'),
(2, 4, 'Assignment Reminder', 'Please submit your assignment by the due date to avoid late penalties.', FALSE, 'direct'),
(5, 1, 'Results Inquiry', 'When will the midterm results be published?', FALSE, 'direct');

-- Sample Results
INSERT INTO results (student_id, course_id, score, grade, gpa_points, academic_year, semester, released_date, is_released) VALUES
(3, 1, 92, 'A', 4.0, '2024/2025', 1, '2024-01-25', TRUE),
(3, 2, 87, 'B+', 3.5, '2024/2025', 1, '2024-01-25', TRUE),
(4, 1, 82, 'B', 3.0, '2024/2025', 1, '2024-01-25', TRUE),
(5, 1, 89, 'A-', 3.7, '2024/2025', 1, '2024-01-25', TRUE);

-- Sample Class Enrollments
INSERT INTO class_enrollments (student_id, class_name, academic_year, semester, enrolled_at) VALUES
(3, 'BS Computer Science - Year 1', '2024/2025', 1, '2024-01-08'),
(4, 'BS Computer Science - Year 1', '2024/2025', 1, '2024-01-08'),
(5, 'BS Computer Science - Year 1', '2024/2025', 1, '2024-01-08'),
(6, 'BS Computer Science - Year 1', '2024/2025', 1, '2024-01-08');

-- Sample E-Book Downloads
INSERT INTO ebook_downloads (student_id, ebook_id, download_date) VALUES
(3, 1, '2024-01-15'),
(3, 2, '2024-01-16'),
(4, 1, '2024-01-17'),
(5, 3, '2024-01-18');

-- Note: The password hashes above are examples. To generate real hashes, use:
-- echo -n "password123" | sha256sum
-- Replace the hash values with actual SHA-256 hashes of your passwords
