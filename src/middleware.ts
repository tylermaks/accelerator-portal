import { NextRequest, NextResponse } from "next/server";
import { updateSession } from '@/utils/supabase/middleware'
import { createClient } from '@/utils/supabase/server'

const publicRoutes = ['/', '/reset-password']; 

const roleRoutes = {
    admin: ['/admin/dashboard', '/admin/members', '/admin/controls'],
    mentor: ['/mentor/meeting-tracker', '/mentor/profile', '/mentor/reports', '/mentor/faqs',],
    company: ['/company/dashboard', '/company/mentors', '/company/faqs'],
};

const defaultRoutes = {
    admin: '/admin/dashboard',
    mentor: '/mentor/meeting-tracker',
    company: '/company/dashboard',
};

export async function middleware(request: NextRequest){
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    const { pathname } = request.nextUrl;

    if(user) {
        let { data: user_profiles, error } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (error) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        const userRole = user_profiles?.role as keyof typeof defaultRoutes;
    
        // Redirect to default route if accessing base route
        if (pathname === `/${userRole}`) {
            return NextResponse.redirect(new URL(defaultRoutes[userRole], request.url));
        }

        // // Redirect to default route if accessing unauthorized route
        if (!roleRoutes[userRole].includes(pathname)) {
            return NextResponse.redirect(new URL(defaultRoutes[userRole], request.url));
        }
    } else { 
        // Avoid redirect loop if already on the login page
        if (!publicRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)'
    ]
}