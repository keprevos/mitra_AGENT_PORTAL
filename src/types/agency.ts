import { z } from 'zod';

export const createAgencySchema = z.object({
  bankId: z.string().min(1, 'Bank selection is required'),
  name: z.string().min(2, 'Agency name is required'),
  code: z.string().min(2, 'Agency code is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  adminEmail: z.string().email('Valid admin email is required'),
  adminFirstName: z.string().min(2, 'Admin first name is required'),
  adminLastName: z.string().min(2, 'Admin last name is required'),
  adminPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export type CreateAgencyDto = z.infer<typeof createAgencySchema>;

export interface Agency {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  bankId: string;
  bankName?: string;
  status: 'active' | 'inactive';
  staffCount?: number;
  createdAt: Date;
  updatedAt: Date;
}