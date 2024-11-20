import { z } from 'zod';

export const createAgentSchema = z.object({
  name: z.string().min(2, 'Agent name is required'),
  code: z.string().min(2, 'Agent code is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  adminEmail: z.string().email('Valid admin email is required'),
  adminFirstName: z.string().min(2, 'Admin first name is required'),
  adminLastName: z.string().min(2, 'Admin last name is required'),
  adminPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export type CreateAgentDto = z.infer<typeof createAgentSchema>;

export interface Agent {
  id: string;
  name: string;
  code: string;
  email: string;
  p