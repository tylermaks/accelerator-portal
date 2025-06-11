import { createUser, deleteUser } from './admin-actions';
import * as supabaseServer from '@/utils/supabase/server';
import * as z from 'zod';

// Mock next/cache's revalidatePath at the module level
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));
import { revalidatePath } from 'next/cache';

describe('admin-actions', () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      rpc: jest.fn(),
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id', email: 'test@example.com', user_metadata: { user_type: 'admin' } } }, error: null }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { user_type: 'admin' }, error: null }),
      }),
    };
    jest.spyOn(supabaseServer, 'createClient').mockResolvedValue(mockSupabase);
    (revalidatePath as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createUser', () => {
    const validForm = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      userType: 'mentor',
      companyName: 'TestCo',
    };

    it('creates a user successfully', async () => {
      mockSupabase.rpc.mockResolvedValue({ data: { id: 1 }, error: null });
      const result = await createUser(validForm);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('create_user', {
        email: validForm.email,
        password: validForm.password,
        first_name: validForm.firstName,
        last_name: validForm.lastName,
        user_type: validForm.userType.toLowerCase(),
        company_name: validForm.companyName,
      });
      expect(revalidatePath).toHaveBeenCalledWith('/admin/members');
      expect(result).toEqual({ message: 'User created successfully', status: 200 });
    });

    it('returns validation error for invalid input', async () => {
      const invalidForm = { ...validForm, email: 'bademail' };
      const result = await createUser(invalidForm);
      expect(result.status).toBe(400);
      expect(result.error).toMatch(/Invalid email address/);
      expect(mockSupabase.rpc).not.toHaveBeenCalled();
    });

    it('returns error if Supabase RPC fails', async () => {
      mockSupabase.rpc.mockResolvedValue({ data: null, error: { message: 'fail' } });
      const result = await createUser(validForm);
      expect(result.status).toBe(500);
      expect(result.error).toMatch(/creating the user/);
    });

    it('returns error for unexpected exceptions', async () => {
      mockSupabase.rpc.mockImplementation(() => { throw new Error('Unexpected'); });
      const result = await createUser(validForm);
      expect(result.status).toBe(500);
      expect(result.error).toMatch(/unexpected/i);
    });
  });

  describe('deleteUser', () => {
    it('deletes a user successfully', async () => {
      mockSupabase.rpc.mockResolvedValue({ data: { success: true }, error: null });
      const formData = { get: (key: string) => 'user-id-123' } as unknown as FormData;
      await deleteUser(formData);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('delete_user', { target_user_id: 'user-id-123' });
      expect(revalidatePath).toHaveBeenCalledWith('/admin/members');
    });

    it('logs error if Supabase RPC fails', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(jest.fn());
      mockSupabase.rpc.mockResolvedValue({ data: null, error: { message: 'fail' } });
      const formData = { get: (key: string) => 'user-id-123' } as unknown as FormData;
      await deleteUser(formData);
      expect(errorSpy).toHaveBeenCalledWith('Error deleting user:', { message: 'fail' });
    });
  });
}); 