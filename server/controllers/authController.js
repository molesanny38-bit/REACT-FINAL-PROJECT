import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDbPool } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'campus_findit_secret_jwt_key_2026';

// In-memory fallback in case MySQL server isn't running locally yet
const inMemoryStudents = [];

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, studentId: user.student_id || user.studentId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc Register a new student
// @route POST /api/auth/register
export async function registerStudent(req, res) {
  try {
    const { fullName, studentId, email, password, major } = req.body;

    if (!fullName || !studentId || !email || !password) {
      return res.status(400).json({ message: 'All student fields are required.' });
    }

    const pool = await getDbPool();

    // 1. If MySQL is connected
    if (pool) {
      // Check if student already exists
      const [existing] = await pool.query(
        'SELECT id FROM students WHERE email = ? OR student_id = ? LIMIT 1',
        [email.trim().toLowerCase(), studentId.trim()]
      );

      if (existing.length > 0) {
        return res.status(400).json({ message: 'Student ID or campus email is already registered.' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Insert record
      const [result] = await pool.query(
        `INSERT INTO students (full_name, student_id, email, password_hash, major, role) 
         VALUES (?, ?, ?, ?, ?, 'student')`,
        [fullName.trim(), studentId.trim(), email.trim().toLowerCase(), passwordHash, major || 'General Studies']
      );

      const newStudent = {
        id: result.insertId,
        name: fullName,
        studentId,
        email: email.toLowerCase(),
        major,
        role: 'student'
      };

      const token = generateToken(newStudent);
      return res.status(201).json({ user: newStudent, token });
    }

    // 2. In-Memory Fallback if MySQL is offline
    const existingMemory = inMemoryStudents.find(
      s => s.email === email.toLowerCase() || s.studentId === studentId
    );
    if (existingMemory) {
      return res.status(400).json({ message: 'Student ID or campus email is already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const memoryUser = {
      id: 'mem-' + Date.now(),
      name: fullName,
      studentId,
      email: email.toLowerCase(),
      passwordHash,
      major: major || 'General Studies',
      role: 'student'
    };
    inMemoryStudents.push(memoryUser);

    const token = generateToken(memoryUser);
    return res.status(201).json({
      user: {
        id: memoryUser.id,
        name: memoryUser.name,
        studentId: memoryUser.studentId,
        email: memoryUser.email,
        major: memoryUser.major,
        role: memoryUser.role
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
}

// @desc Student Login
// @route POST /api/auth/login
export async function loginStudent(req, res) {
  try {
    const { identifier, password } = req.body; // identifier can be email or studentId

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide student email/ID and password.' });
    }

    const cleanId = identifier.trim().toLowerCase();
    const pool = await getDbPool();

    // 1. If MySQL is connected
    if (pool) {
      const [rows] = await pool.query(
        'SELECT * FROM students WHERE LOWER(email) = ? OR LOWER(student_id) = ? LIMIT 1',
        [cleanId, cleanId]
      );

      if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid campus credentials. Student record not found.' });
      }

      const student = rows[0];
      const isMatch = await bcrypt.compare(password, student.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password. Please check your credentials.' });
      }

      const userData = {
        id: student.id,
        name: student.full_name,
        studentId: student.student_id,
        email: student.email,
        major: student.major,
        role: student.role
      };

      const token = generateToken(userData);
      return res.json({ user: userData, token });
    }

    // 2. In-Memory Fallback if MySQL is offline
    const memoryStudent = inMemoryStudents.find(
      s => s.email.toLowerCase() === cleanId || s.studentId.toLowerCase() === cleanId
    );

    if (!memoryStudent) {
      return res.status(401).json({ message: 'Invalid campus credentials. Student not found.' });
    }

    const isMatch = await bcrypt.compare(password, memoryStudent.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    const userData = {
      id: memoryStudent.id,
      name: memoryStudent.name,
      studentId: memoryStudent.studentId,
      email: memoryStudent.email,
      major: memoryStudent.major,
      role: memoryStudent.role
    };

    const token = generateToken(userData);
    return res.json({ user: userData, token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
}

// @desc Get current student profile
// @route GET /api/auth/me
export async function getStudentProfile(req, res) {
  try {
    // Decoded user from auth middleware
    return res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve profile' });
  }
}
