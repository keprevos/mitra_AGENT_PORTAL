import { z } from 'zod';

export const createBankSchema = z.object({
  name: z.string().min(2, 'Bank name is required'),
  code: z.string().min(2, 'Bank code is required'),
  address: z.string().min(5, 'Address is required'),
  adminEmail: z.string().email('Valid email is required'),
  adminFirstName: z.string().min(2, 'First name is required'),
  adminLastName: z.string().min(2, 'Last name is required'),
  adminPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export type CreateBankDto = z.infer<typeof createBankSchema>;

export interface Bank {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  permissions: {
    canCreateStaff: boolean;
    canCreateAgents: boolean;
    canAssignRoles: boolean;
  };
}