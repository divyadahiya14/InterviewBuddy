import * as authService from '../services/authService.js';
import { generateToken } from '../utils/jwtUtil.js';

export const getUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const loginResponse = await authService.loginUser(email, password, role);

    // Generate JWT
    const token = generateToken(loginResponse.email, loginResponse.role, loginResponse.name);

    // Set HTTP-only cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction, // Set to true in production with HTTPS
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 86400000 // 1 day
    });

    res.json(loginResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { email, name, role } = req.body;
    const loginResponse = await authService.googleLoginUser(email, name, role);

    // Generate JWT
    const token = generateToken(loginResponse.email, loginResponse.role, loginResponse.name);

    // Set HTTP-only cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 86400000 // 1 day
    });

    res.json(loginResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMe = async (req, res) => {
  const email = req.userEmail;
  const role = req.userRole;
  const name = req.userName;

  if (!email) {
    return res.json({ loggedIn: false });
  }

  res.json({
    loggedIn: true,
    email,
    role,
    name
  });
};

export const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: 0
  });
  res.json({ message: 'Logged out successfully' });
};

export const sendOtp = async (req, res) => {
  try {
    const { email, role, type } = req.body;
    const result = await authService.sendOtpService(email, role, type);
    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const ok = await authService.verifyOtpService(email, otp);

    if (!ok) {
      return res.status(400).send('Invalid or Expired OTP');
    }

    res.send('OTP Verified');
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const result = await authService.resetPasswordService(email, newPassword);
    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name || !name.trim()) {
      return res.status(400).json({ message: 'Email and Name are required' });
    }

    const user = await authService.updateProfileService(email, name);
    res.json({
      message: 'Profile updated successfully',
      name: user.name
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
