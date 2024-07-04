import { NextRequest, NextResponse } from "next/server";
import { updateSession } from '@/utils/supabase/middleware';
import { createClient } from '@/utils/supabase/server';

const publicRoutes = ['/', '/reset-password'];

const roleRoutes: { [key: string]: string[] } = {
    admin: ['/admin/dashboard', '/admin/members', '/admin/controls'],
    mentor: ['/mentor/meeting-tracker', '/mentor/profile', '/mentor/reports', '/mentor/support-requests', '/mentor/faqs'],
    company: ['/company/dashboard', '/company/mentors', '/company/faqs'],
};

const defaultRoutes: { [key: string]: string } = {
    admin: '/admin/dashboard',
    mentor: '/mentor/meeting-tracker',
    company: '/company/dashboard',
};

export async function middleware(request: NextRequest) {
    const supabase = createClient();
    const sessionToken = request.cookies.get('sessionToken');

    let userRole: string | undefined;

    if (sessionToken) {
        userRole = sessionToken.value;
    } else {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user) {
            const { data: userProfile, error } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (error) {
                return NextResponse.redirect(new URL('/', request.url));
            }

            // Set user role
            userRole = userProfile?.role;
            // Store role in a cookie
            const sessionToken = userProfile?.role;

            const response = NextResponse.next();
            response.cookies.set('sessionToken', sessionToken, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            // Continue with routing logic after setting the cookie
            const routingResponse = await handleRouting(request, userRole);
            if (routingResponse) {
                return routingResponse;
            }

            return response;
        }
    }

    // Handle routing logic
    const routingResponse = await handleRouting(request, userRole);
    if (routingResponse) {
        return routingResponse;
    }

    return await updateSession(request);
}

async function handleRouting(request: NextRequest, userRole: string | undefined) {
    const { pathname } = request.nextUrl;

    if (userRole) {
        // Redirect to default route if accessing base route
        if (pathname === `/${userRole}`) {
            return NextResponse.redirect(new URL(defaultRoutes[userRole], request.url));
        }

        // Redirect to default route if accessing unauthorized route
        if (!roleRoutes[userRole].includes(pathname)) {
            return NextResponse.redirect(new URL(defaultRoutes[userRole], request.url));
        }
    } else {
        // Avoid redirect loop if already on the login page
        if (!publicRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return null;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)'
    ]
};
