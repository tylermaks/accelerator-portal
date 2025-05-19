import { cookies } from 'next/headers';

/**
 * Default cookie options enforcing security best practices.
 */
const defaultOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  path?: string;
  expires?: Date;
  maxAge?: number;
}

/**
 * Set a cookie with secure defaults. Options can be overridden.
 */
export async function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
) {
  const cookieStore = await cookies();
  cookieStore.set(name, value, { ...defaultOptions, ...options });
}

/**
 * Get a cookie value by name.
 */
export async function getCookie(name: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}

/**
 * Check if a cookie exists by name.
 */
export async function hasCookie(name: string): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(name);
}

/**
 * Get all cookies (optionally filter by name).
 */
export async function getAllCookies(name?: string) {
  const cookieStore = await cookies();
  return name ? cookieStore.getAll(name) : cookieStore.getAll();
}

/**
 * Delete a cookie by name.
 */
export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
} 