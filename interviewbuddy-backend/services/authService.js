import bcrypt from 'bcryptjs';
import axios from 'axios';
import User from '../models/User.js';

// In-memory OTP storage
const otpStore = new Map();
const expiryStore = new Map();

// Generate a random 6-digit OTP
const generateRandomOtp = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

export const getAllUsers = async () => {
  return await User.find({});
};

export const registerUser = async (userData) => {
  const email = userData.email ? userData.email.trim() : '';
  let existingUser = await User.findOne({ email });

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  if (existingUser) {
    // Override existing user details for easier testing (matching Java backend behavior)
    existingUser.password = hashedPassword;
    if (userData.role) {
      existingUser.role = userData.role;
    }
    if (userData.name && userData.name.trim()) {
      existingUser.name = userData.name;
    }
    return await existingUser.save();
  }

  const newUser = new User({
    name: userData.name,
    email: email,
    password: hashedPassword,
    role: userData.role
  });

  return await newUser.save();
};

export const loginUser = async (email, password, role) => {
  const user = await User.findOne({ email: email ? email.trim() : '' });
  if (!user) {
    throw new Error('User not found');
  }

  // Check Password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid Credentials');
  }

  // Role check & update if different (test capability override)
  if (!user.role || user.role.toLowerCase() !== role.toLowerCase()) {
    user.role = role.toUpperCase();
    await user.save();
  }

  return {
    message: 'Login Successful',
    name: user.name,
    role: user.role,
    email: user.email
  };
};

export const googleLoginUser = async (email, name, role) => {
  let user = await User.findOne({ email: email ? email.trim() : '' });

  if (user) {
    // Allow role change for testing
    if (!user.role || user.role.toLowerCase() !== role.toLowerCase()) {
      user.role = role.toUpperCase();
      await user.save();
    }
  } else {
    // Create new user for Google login
    user = new User({
      email: email ? email.trim() : '',
      name,
      password: '', // Empty password for social login
      role: role.toUpperCase()
    });
    await user.save();
  }

  return {
    message: 'Google Login Success',
    name: user.name,
    role: user.role,
    email: user.email
  };
};

export const sendOtpService = async (email, role, type = 'REGISTER') => {
  if (!email || !email.trim()) {
    throw new Error('Email is required');
  }

  const cleanEmail = email.trim();
  const lowerRole = role ? role.toLowerCase() : 'interviewee';
  const cleanType = type ? type.toUpperCase() : 'REGISTER';

  const user = await User.findOne({ email: cleanEmail });

  // REGISTER checks
  if (cleanType === 'REGISTER') {
    if (user && user.role && user.role.toLowerCase() === lowerRole) {
      throw new Error('You are already registered');
    }
  }

  // FORGOT checks
  if (cleanType === 'FORGOT') {
    if (!user) {
      throw new Error('This email is not registered');
    }
  }

  // OTP Generation
  const otp = generateRandomOtp();
  otpStore.set(cleanEmail, otp);
  expiryStore.set(cleanEmail, new Date(Date.now() + 5 * 60 * 1000)); // 5 minutes validity

  console.log('====================================================');
  console.log(`[OTP GENERATED] Email: ${cleanEmail} | OTP: ${otp}`);
  console.log('====================================================');

  const brevoApiKey = process.env.BREVO_API_KEY;
  const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!brevoApiKey || !brevoApiKey.trim() || !brevoSenderEmail || !brevoSenderEmail.trim()) {
    console.log('[BREVO CONFIG MISSING] Falling back to local console OTP delivery.');
    return 'OTP sent successfully';
  }

  try {
    const htmlBody = `
      <div style='font-family:Arial;padding:20px'>
        <h2>Interview Buddy</h2>
        <p>Your OTP is:</p>
        <div style='font-size:22px;font-weight:bold;padding:10px;border:1px solid #ccc;display:inline-block;'>
          ${otp}
        </div>
        <p>Valid for 5 minutes only</p>
      </div>
    `;

    const payload = {
      sender: { name: 'Interview Buddy', email: brevoSenderEmail },
      to: [{ email: cleanEmail }],
      subject: 'Interview Buddy - OTP Verification',
      htmlContent: htmlBody
    };

    const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (response.status === 200 || response.status === 201) {
      console.log(`[BREVO SUCCESS] OTP email successfully sent to ${cleanEmail}`);
    } else {
      console.error(`[BREVO ERROR] Status Code: ${response.status}`);
      console.log('[FALLBACK] Brevo API failed. Local console OTP fallback is active.');
    }
  } catch (error) {
    console.error(`[BREVO EXCEPTION] Failed to send email via Brevo: ${error.message}`);
    console.log('[FALLBACK] Local console OTP fallback is active.');
  }

  return 'OTP sent successfully';
};

export const verifyOtpService = async (email, otp) => {
  const cleanEmail = email ? email.trim() : '';
  if (!otpStore.has(cleanEmail)) {
    return false;
  }

  const expiry = expiryStore.get(cleanEmail);
  if (expiry < new Date()) {
    otpStore.delete(cleanEmail);
    expiryStore.delete(cleanEmail);
    return false;
  }

  const storedOtp = otpStore.get(cleanEmail);
  return storedOtp === String(otp);
};

export const resetPasswordService = async (email, newPassword) => {
  console.log('RESET API HIT');
  console.log('EMAIL: ' + email);

  const cleanEmail = email ? email.trim() : '';
  const user = await User.findOne({ email: cleanEmail });
  if (!user) {
    throw new Error('User not found');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return 'Password reset successful';
};

export const updateProfileService = async (email, name) => {
  const cleanEmail = email ? email.trim() : '';
  const user = await User.findOne({ email: cleanEmail });
  if (!user) {
    throw new Error('User not found');
  }

  user.name = name;
  return await user.save();
};
