import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.get('/users', authController.getUsers);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);
router.get('/me', authController.getMe);
router.post('/logout', authController.logout);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);
router.put('/profile', authController.updateProfile);

export default router;
