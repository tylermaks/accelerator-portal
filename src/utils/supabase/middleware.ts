import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'


const publicRoutes = ['/', '/reset-password', '/error', '/confirm-reset']; 

const roleRoutes: { [key: string]: string[] } = {
    admin: ['/admin/dashboard', '/admin/members', '/admin/controls', '/dashboard/meeting-tracker', '/dashboard/profile', '/dashboard/reports', '/dashboard/support-requests', '/dashboard/faqs/eir', '/dashboard/faqs/mentor'],
    eir: ['/dashboard/meeting-tracker', '/dashboard/profile', '/dashboard/reports', '/dashboard/support-requests', '/dashboard/faqs/eir'],
    mentor: ['/dashboard/meeting-tracker', '/dashboard/profile', '/dashboard/support-requests', '/dashboard/faqs/mentor'],
    company: ['/company/dashboard', '/company/mentors', '/company/faqs'],
};

const defaultRoutes: { [key: string]: string } = {
    admin: '/admin/members',
    eir: '/dashboard/meeting-tracker',
    mentor: '/dashboard/meeting-tracker',
    company: '/dashboard',
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })


  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userRole = user?.user_metadata.user_type
  const pathName = request.nextUrl.pathname

   // Check if user exists and user_type cookie doesn't exist
   if (user && userRole && !request.cookies.get('user_type')) {
    // Set the user_type cookie
    supabaseResponse.cookies.set('user_type', userRole, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
    })
  }

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/') &&
    !request.nextUrl.pathname.startsWith('/reset-password')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (userRole) {
    // Redirect to public routes if logged in
    if (publicRoutes.includes(pathName)) {
        const newResponse = NextResponse.redirect(new URL(defaultRoutes[userRole], request.url));
        supabaseResponse.cookies.getAll().forEach(cookie => {
          newResponse.cookies.set(cookie.name, cookie.value)
        });
        return newResponse
    }

    // Check route permissions
    if (roleRoutes[userRole]) {
        if (!roleRoutes[userRole].includes(pathName)) {
          const newResponse = NextResponse.redirect(new URL(defaultRoutes[userRole], request.url));
          supabaseResponse.cookies.getAll().forEach(cookie => {
            newResponse.cookies.set(cookie.name, cookie.value)
          });
          return newResponse
        }
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}