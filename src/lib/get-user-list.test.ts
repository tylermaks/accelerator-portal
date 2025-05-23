import { getUserList } from './get-user-list';
import * as supabaseServer from '@/utils/supabase/server';

describe('getUserList', () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn(),
    };
    jest.spyOn(supabaseServer, 'createClient').mockResolvedValue(mockSupabase);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns sorted user list on success', async () => {
    const users = [
      { first_name: 'Zoe', last_name: 'Smith' },
      { first_name: 'Anna', last_name: 'Brown' },
      { first_name: 'Mike', last_name: 'Jones' },
    ];
    mockSupabase.select.mockResolvedValue({ data: users, error: null });
    const result = await getUserList();
    expect(result).toEqual([
      { first_name: 'Anna', last_name: 'Brown' },
      { first_name: 'Mike', last_name: 'Jones' },
      { first_name: 'Zoe', last_name: 'Smith' },
    ]);
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
    expect(mockSupabase.select).toHaveBeenCalledWith('*');
  });

  it('returns empty array on error', async () => {
    mockSupabase.select.mockResolvedValue({ data: null, error: { message: 'fail' } });
    const result = await getUserList();
    expect(result).toEqual([]);
  });

  it('returns empty array if no users', async () => {
    mockSupabase.select.mockResolvedValue({ data: [], error: null });
    const result = await getUserList();
    expect(result).toEqual([]);
  });
}); 