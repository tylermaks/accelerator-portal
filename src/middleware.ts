import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest){
    const res = NextResponse.next();
    const { pathname } = req.nextUrl;
    const supabase = createMiddlewareClient({req, res});
    const { data: { session }, error } = await supabase.auth.getSession();

    const publicRoutes = ['/', '/auth/login', '/auth/callback', '/reset-password']; 

    const roleRoutes = {
        admin: ['/admin/dashboard', '/admin/members', '/admin/controls'],
        mentor: ['/mentor/meeting-tracker', '/mentor/profiles', '/mentor/reports', '/mentor/faqs',],
        company: ['/company/dashboard', '/company/mentors', '/company/faqs'],
    };

    const defaultRoutes = {
        admin: '/admin/dashboard',
        mentor: '/mentor/meeting-tracker',
        company: '/company/dashboard',
    };

    if (publicRoutes.includes(pathname)) {
        return res
    }

    
    if(session) {
        if(pathname === '/auth/logout') {
            return res
        }

        const userId = session.user.id;
        let { data: user_profiles, error } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', userId)
            .single()

        if (error) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        const userRole = user_profiles?.role as keyof typeof defaultRoutes;

        // Redirect to default route if accessing base route
        if (pathname === `/${userRole}`) {
            return NextResponse.redirect(new URL(defaultRoutes[userRole], req.url));
        }

        // Redirect to default route if accessing unauthorized route
        if (!roleRoutes[userRole].includes(pathname)) {
            return NextResponse.redirect(new URL(defaultRoutes[userRole], req.url));
        }
    } else { 
        // Avoid redirect loop if already on the login page
        if (!publicRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return res
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)'
    ]
}