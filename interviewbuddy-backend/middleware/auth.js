import { verifyToken } from '../utils/jwtUtil.js';

export const jwtInterceptor = (req, res, next) => {
  // 1. Allow preflight OPTIONS requests automatically
  if (req.method === 'OPTIONS') {
    return next();
  }

  // 2. Extract JWT token from cookies
  let token = null;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Fallback to Authorization Header
  if (!token) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  // 3. Populate authentication attributes if a valid token exists
  if (token) {
    try {
      const decoded = verifyToken(token);
      req.userEmail = decoded.email;
      req.userRole = decoded.role;
      req.userName = decoded.name;
    } catch (err) {
      // Token is invalid or expired. We log it but do not fail public endpoints.
      console.log('JWT verification failed:', err.message);
    }
  }

  // 4. Enforce authentication on protected paths
  const uri = req.originalUrl;
  const isProtected = uri.startsWith('/api/candidate') ||
                      uri.startsWith('/api/interviewer') ||
                      uri.startsWith('/api/booking') ||
                      uri.startsWith('/api/ai/interview') ||
                      uri.startsWith('/api/resume');

  if (isProtected) {
    if (!req.userEmail) {
      return res.status(401).json({ error: 'Unauthorized: Please log in to access this resource' });
    }
  }

  next();
};
