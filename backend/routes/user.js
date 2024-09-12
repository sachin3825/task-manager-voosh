import express from 'express';
import { generateAndSendOtp, login, signup } from '../controller/user.js';
import { otpRequestLimiter } from '../middleware/ratelimter.js';
const router = express.Router();

router.post('/login', login);
router.post('/send-otp', otpRequestLimiter, generateAndSendOtp);
router.post('/signup', signup);

export default router;
