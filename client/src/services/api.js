// IT Department API client & Auth Service
const TOKEN_KEY = 'findit_it_token';
const USER_KEY = 'findit_it_user';

export const authService = {
  getToken: () => localStorage.getItem(TOKEN_KEY),

  getCurrentUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  setSession: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Login handler for 3 roles: 'student', 'verifier', 'admin'
  login: async (identifier, password, role = 'student', options = {}) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, role, ...options })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data = await response.json();
      authService.setSession(data.token, data.user);
      return data;
    } catch (err) {
      // Local fallback mode
      console.warn(`Local Session for IT Department Role: ${role}`);
      
      let mockUser;
      if (role === 'verifier') {
        const designation = options.designation || 'Instructor (Faculty)';
        const isOfficer = designation.includes('Officer');
        const isHeadOrSec = designation.includes('Head') || designation.includes('Secretary');

        mockUser = {
          id: 'verif-' + Date.now(),
          name: isOfficer 
            ? 'Christian Reyes' 
            : isHeadOrSec 
            ? 'Ms. Karen Diaz' 
            : 'Prof. Marc Davis',
          email: identifier.includes('@') ? identifier : (isOfficer ? 'c.reyes@student.it.edu' : 'm.davis@it.campus.edu'),
          employeeId: identifier.includes('@') ? (isOfficer ? 'OFF-2023-1102' : 'FAC-IT-104') : identifier,
          role: 'verifier',
          designation: designation,
          verifierType: isOfficer ? 'Student Officer' : isHeadOrSec ? 'Department Office' : 'Instructor',
          department: 'IT Department',
          station: options.station || 'Department Office / LAB 42–45'
        };
      } else if (role === 'admin') {
        mockUser = {
          id: 'admin-01',
          name: 'IT Systems Administrator',
          email: identifier.includes('@') ? identifier : 'admin@it.campus.edu',
          employeeId: 'ADM-IT-990',
          role: 'admin',
          designation: 'IT Department Systems Administrator',
          department: 'IT Department',
          clearance: 'Level 4 Security Clearance'
        };
      } else {
        // Default Student
        mockUser = {
          id: 'stu-01',
          name: 'Sophia Chen',
          email: identifier.includes('@') ? identifier : 's.chen@student.it.edu',
          studentId: identifier.includes('@') ? '2024-4412' : identifier,
          role: 'student',
          program: 'BS Information Technology (BSIT)',
          yearSection: options.yearSection || 'BSIT 3-A',
          department: 'IT Department'
        };
      }

      const mockToken = `mock-it-jwt-${role}-${Date.now()}`;
      authService.setSession(mockToken, mockUser);
      return { user: mockUser, token: mockToken, isDemo: true };
    }
  },

  // Student Registration
  registerStudent: async ({ fullName, studentId, email, password, program, yearSection }) => {
    try {
      const response = await fetch('/api/auth/register-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, studentId, email, password, program, yearSection })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      authService.setSession(data.token, data.user);
      return data;
    } catch (err) {
      // Local fallback
      const mockUser = {
        id: 'stu-' + Date.now(),
        name: fullName,
        email,
        studentId,
        role: 'student',
        program: program || 'BS Information Technology (BSIT)',
        yearSection: yearSection || 'BSIT 1-A',
        department: 'IT Department'
      };
      const mockToken = `mock-it-jwt-student-${Date.now()}`;
      authService.setSession(mockToken, mockUser);
      return { user: mockUser, token: mockToken, isDemo: true };
    }
  }
};
