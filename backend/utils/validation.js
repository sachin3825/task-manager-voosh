import { z } from 'zod';

export const signinSchema = z.object({
  googleAccessToken: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
});

export const normalSignupSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  otp: z.string().min(6, 'OTP must be 6 characters'),
});

export const googleSignupSchema = z.object({
  googleAccessToken: z.string().min(1, 'Google access token is required'),
});
