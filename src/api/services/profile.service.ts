import { z } from 'zod';

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  department: z.string().optional(),
  phone: z.string().optional(),
  notificationPreferences: z.object({
    emailNotifications: z.boolean(),
    browserNotifications: z.boolean(),
    activityAlerts: z.boolean(),
    securityAlerts: z.boolean()
  }),
  twoFactorEnabled: z.boolean()
});

export type ProfileUpdateDto = z.infer<typeof profileUpdateSchema>;

export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type PasswordUpdateDto = z.infer<typeof passwordUpdateSchema>;

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  phone?: string;
  bankId?: string;
  agencyId?: string;
  lastLogin?: Date;
  notificationPreferences: {
    emailNotifications: boolean;
    browserNotifications: boolean;
    activityAlerts: boolean;
    securityAlerts: boolean;
  };
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}