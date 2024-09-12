import rateLimit from 'express-rate-limit';

export const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    message: 'Too many OTP requests from this IP, please try again after 15 minutes',
  },
  headers: true,
});
