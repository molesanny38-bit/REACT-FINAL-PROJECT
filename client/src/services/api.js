// API client service for authentication

const TOKEN_KEY = 'findit_token';
const USER_KEY = 'findit_user';

export const authService = {
  // Get stored token
  getToken: () => localStorage.getItem(TOKEN_KEY),

  // Get current logged-in user
  getCurrentUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  // Save auth session
  setSession: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Log out
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Student Login
  login: async (emailOrStudentId, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: emailOrStudentId, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data = await response.json();
      authService.setSession(data.token, data.user);
      return data;
    } catch (err) {
      // If backend is not yet started, allow demo mode so student can test immediately
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        console.warn('Backend server offline. Running in Demo Authentication Mode.');
        const mockUser = {
          id: 'stu-demo-01',
          name: emailOrStudentId.includes('@') ? emailOrStudentId.split('@')[0] : 'Demo Student',
          email: emailOrStudentId.includes('@') ? emailOrStudentId : 'student@campus.edu',
          studentId: emailOrStudentId.includes('@') ? 'STU-2024-8841' : emailOrStudentId,
          role: 'student',
          major: 'Computer Science'
        };
        const mockToken = 'mock-jwt-token-demo';
        authService.setSession(mockToken, mockUser);
        return { user: mockUser, token: mockToken, isDemo: true };
      }
      throw err;
    }
  },

  // Student Registration
  register: async ({ fullName, studentId, email, password, major }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, studentId, email, password, major })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      authService.setSession(data.token, data.user);
      return data;
    } catch (err) {
      // If backend is not yet started, allow demo mode
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        console.warn('Backend server offline. Running in Demo Registration Mode.');
        const mockUser = {
          id: 'stu-' + Date.now(),
          name: fullName,
          email,
          studentId,
          role: 'student',
          major: major || 'General Studies'
        };
        const mockToken = 'mock-jwt-token-demo';
        authService.setSession(mockToken, mockUser);
        return { user: mockUser, token: mockToken, isDemo: true };
      }
      throw err;
    }
  }
};
