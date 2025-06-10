import type { SupabaseClient } from '@supabase/supabase-js'

const ROLE_PRIORITY = ['mentor', 'eir', 'admin'];

export async function requireRole(supabase: SupabaseClient, requiredRole?: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Not authenticated');
  }

  // Query the profiles table for the user's role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('User profile or role not found');
  }

  const userIndex = ROLE_PRIORITY.indexOf(profile.user_type);
  const requiredIndex = ROLE_PRIORITY.indexOf(requiredRole ?? '');

  if (userIndex === -1 || requiredIndex === -1 || userIndex < requiredIndex) {
    throw new Error('Forbidden: Insufficient role');
  }

  return user;
} 