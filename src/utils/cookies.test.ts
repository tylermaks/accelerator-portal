import { setCookie, getCookie, hasCookie, getAllCookies, deleteCookie } from './cookies';
import { cookies } from 'next/headers';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('cookies utility', () => {
  let mockSet: jest.Mock;
  let mockGet: jest.Mock;
  let mockHas: jest.Mock;
  let mockGetAll: jest.Mock;
  let mockDelete: jest.Mock;

  beforeEach(() => {
    mockSet = jest.fn();
    mockGet = jest.fn();
    mockHas = jest.fn();
    mockGetAll = jest.fn();
    mockDelete = jest.fn();
    (cookies as jest.Mock).mockReturnValue({
      set: mockSet,
      get: mockGet,
      has: mockHas,
      getAll: mockGetAll,
      delete: mockDelete,
    });
  });

  it('setCookie sets secure flags by default', async () => {
    await setCookie('test', 'value');
    expect(mockSet).toHaveBeenCalledWith(
      'test',
      'value',
      expect.objectContaining({
        httpOnly: true,
        secure: expect.any(Boolean),
        sameSite: 'lax',
        path: '/',
      })
    );
  });

  it('setCookie allows overriding options', async () => {
    await setCookie('test', 'value', { httpOnly: false, sameSite: 'strict' });
    expect(mockSet).toHaveBeenCalledWith(
      'test',
      'value',
      expect.objectContaining({
        httpOnly: false,
        sameSite: 'strict',
      })
    );
  });

  it('getCookie returns the value if present', async () => {
    mockGet.mockReturnValue({ value: 'abc' });
    const value = await getCookie('test');
    expect(value).toBe('abc');
    expect(mockGet).toHaveBeenCalledWith('test');
  });

  it('getCookie returns undefined if not present', async () => {
    mockGet.mockReturnValue(undefined);
    const value = await getCookie('missing');
    expect(value).toBeUndefined();
  });

  it('hasCookie returns true/false', async () => {
    mockHas.mockReturnValue(true);
    expect(await hasCookie('foo')).toBe(true);
    mockHas.mockReturnValue(false);
    expect(await hasCookie('bar')).toBe(false);
  });

  it('getAllCookies returns all cookies', async () => {
    const cookiesArr = [
      { name: 'a', value: '1' },
      { name: 'b', value: '2' },
    ];
    mockGetAll.mockReturnValue(cookiesArr);
    const all = await getAllCookies();
    expect(all).toBe(cookiesArr);
    expect(mockGetAll).toHaveBeenCalled();
  });

  it('getAllCookies with name returns filtered cookies', async () => {
    const cookiesArr = [
      { name: 'foo', value: 'bar' },
    ];
    mockGetAll.mockReturnValue(cookiesArr);
    const filtered = await getAllCookies('foo');
    expect(filtered).toBe(cookiesArr);
    expect(mockGetAll).toHaveBeenCalledWith('foo');
  });

  it('deleteCookie calls delete', async () => {
    await deleteCookie('test');
    expect(mockDelete).toHaveBeenCalledWith('test');
  });
}); 