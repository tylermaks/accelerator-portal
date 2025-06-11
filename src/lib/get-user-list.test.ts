import { getUserList } from './get-user-list';
import * as supabaseServer from '@/utils/supabase/server';

describe('getUserList', () => {
  let mockSupabase: any;
  let mockAuthGetUser: any;
  let mockFrom: any;
  let mockSelect: any;
  let mockEq: any;
  let mockSingle: any;
  let userListReturnValue: any;

  beforeEach(() => {
    mockAuthGetUser = jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id', email: 'test@example.com', user_metadata: { user_type: 'admin' } } }, error: null });
    
    // Define mocks for the end of the chain first
    mockSingle = jest.fn();

    // Define mock for eq, it should return an object that has single
    mockEq = jest.fn().mockReturnValue({
        single: mockSingle
    });

    // Define mock for select, always return the correct shape based on argument
    mockSelect = jest.fn((arg) => {
      if (arg === 'user_type') {
        return { eq: mockEq };
      }
      if (arg === '*') {
        // Return the test-scoped value for user list
        return Promise.resolve(userListReturnValue);
      }
      return {};
    });

    // Define mock for from, it should return an object that has select
    mockFrom = jest.fn().mockReturnValue({
        select: mockSelect
    });

    mockSupabase = {
      auth: {
        getUser: mockAuthGetUser,
      },
      from: mockFrom,
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

    // Mock the call made by requireRole (profiles table)
    mockSingle.mockResolvedValueOnce({ data: { user_type: 'admin' }, error: null });

    // Set the test-scoped return value for select('*')
    userListReturnValue = { data: users, error: null };

    const result = await getUserList();

    expect(result).toEqual([
      { first_name: 'Anna', last_name: 'Brown' },
      { first_name: 'Mike', last_name: 'Jones' },
      { first_name: 'Zoe', last_name: 'Smith' },
    ]);
    expect(mockFrom).toHaveBeenCalledWith('profiles');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockSelect).toHaveBeenCalledWith('user_type'); 
    expect(mockEq).toHaveBeenCalledWith('user_id', 'test-user-id');
    expect(mockSingle).toHaveBeenCalled();
  });

  it('returns empty array on error', async () => {
    // Mock requireRole's profile fetch to succeed
    mockSingle.mockResolvedValueOnce({ data: { user_type: 'admin' }, error: null });
    // Set the test-scoped return value for select('*') to simulate error
    userListReturnValue = { data: null, error: { message: 'fail' } };
    const result = await getUserList();
    expect(result).toEqual([]);
  });

  it('returns empty array if no users', async () => {
    // Mock requireRole's profile fetch to succeed
    mockSingle.mockResolvedValueOnce({ data: { user_type: 'admin' }, error: null });
    // Set the test-scoped return value for select('*') to simulate no users
    userListReturnValue = { data: [], error: null };
    const result = await getUserList();
    expect(result).toEqual([]);
  });
}); 