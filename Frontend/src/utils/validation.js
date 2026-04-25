import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  confirmPassword: z.string(),
  role: z.enum(['user', 'contestant']).default('user'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const contestSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(10).max(1000),
  category: z.enum(['music', 'photography', 'video', 'art', 'writing', 'other']),
  startDate: z.date(),
  endDate: z.date(),
  prizes: z.array(z.object({
    position: z.number().min(1),
    amount: z.number().min(1000),
  })),
  entryFee: z.number().min(0).default(0),
  maxContestants: z.number().optional(),
});

export const entrySchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  bio: z.string().max(200).optional(),
  mediaType: z.enum(['image', 'video']),
  media: z.instanceof(File).refine(
    (file) => file.size <= 100 * 1024 * 1024,
    'File must be less than 100MB'
  ),
});

export const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().max(200).optional(),
  avatar: z.string().optional(),
});

export const coinPurchaseSchema = z.object({
  amount: z.number().min(1000, 'Minimum amount is ₦1,000'),
});
