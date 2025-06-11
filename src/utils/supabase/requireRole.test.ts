import { requireRole } from './requireRole';
import type { SupabaseClient } from '@supabase/supabase-js';

const mockUser = { id: 'user-123', email: 'test@example.com' };
const mockSupabase = (user: any, profile: any, userError?: any, profileError?: any) => ({
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user }, error: userError }),
  },
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: profile, error: profileError }),
  }),
}) as unknown as SupabaseClient;

describe('requireRole (with hierarchy)', () => {
  it('throws if not authenticated', async () => {
    const supabase = mockSupabase(null, null);
    await expect(requireRole(supabase, 'admin')).rejects.toThrow('Not authenticated');
  });

  it('throws if user profile or role not found', async () => {
    const supabase = mockSupabase(mockUser, null);
    await expect(requireRole(supabase, 'admin')).rejects.toThrow('User profile or role not found');
  });

  it('throws if user does not have sufficient role (mentor cannot access admin)', async () => {
    const supabase = mockSupabase(mockUser, { user_type: 'mentor' });
    await expect(requireRole(supabase, 'admin')).rejects.toThrow('Forbidden: Insufficient role');
  });

  it('returns user if authenticated and has required role (admin for admin)', async () => {
    const supabase = mockSupabase(mockUser, { user_type: 'admin' });
    await expect(requireRole(supabase, 'admin')).resolves.toEqual(mockUser);
  });

  it('returns user if admin accesses mentor action', async () => {
    const supabase = mockSupabase(mockUser, { user_type: 'admin' });
    await expect(requireRole(supabase, 'mentor')).resolves.toEqual(mockUser);
  });

  it('returns user if admin accesses eir action', async () => {
    const supabase = mockSupabase(mockUser, { user_type: 'admin' });
    await expect(requireRole(supabase, 'eir')).resolves.toEqual(mockUser);
  });

  it('returns user if eir accesses mentor action', async () => {
    const supabase = mockSupabase(mockUser, { user_type: 'eir' });
    await expect(requireRole(supabase, 'mentor')).resolves.toEqual(mockUser);
  });

  it('throws if mentor tries to access eir action', async () => {
    const supabase = mockSupabase(mockUser, { user_type: 'mentor' });
    await expect(requireRole(supabase, 'eir')).rejects.toThrow('Forbidden: Insufficient role');
  });

  it('throws if eir tries to access admin action', async () => {
    const supabase = mockSupabase(mockUser, { user_type: 'eir' });
    await expect(requireRole(supabase, 'admin')).rejects.toThrow('Forbidden: Insufficient role');
  });
}); 