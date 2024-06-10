import { getCookie, setCookie } from "cookies-next";
import { createServerClient } from '@supabase/ssr'

export function createSupabaseReqResClient(req, res) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          //return cookie with the name 'name' here
          return getCookie(name, { req, res });
        },
        set(name, value, options) {
          // set the cookie
          setCookie(name, value, { req, res, ...options });
        },
        remove(name, options) {
          // delete the cookie
          setCookie(name, "", { req, res, ...options });
        },
      },
    }
  );
}
