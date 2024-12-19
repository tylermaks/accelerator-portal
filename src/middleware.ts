import { NextRequest, NextResponse } from "next/server";
import { updateSession } from '@/utils/supabase/middleware'
import { cookies } from 'next/headers';
import { jwtDecode } from "jwt-decode";

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

export async function middleware(request: NextRequest) {
    const SB_TOKEN = process.env.SB_TOKEN;
    try {
        const pathName = request.nextUrl.pathname;
        const cookie = SB_TOKEN && request.cookies.get(SB_TOKEN);
        const token = cookie && cookie.value;

        // If no token and not a public route, redirect to home
        if (!token && !publicRoutes.includes(pathName)) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // If token exists, validate and check routes
        if (token) {
            let decoded;
            try {
                decoded = jwtDecode<{ exp?: number; user_metadata?: { user_type?: string } }>(token);
            } catch (decodeError) {
                console.error('Token decode error:', decodeError);
                // Create a response to clear the cookie and redirect
                const response = NextResponse.redirect(new URL('/', request.url));
                response.cookies.delete(SB_TOKEN);
                return response;
            }

            const isTokenExpired = decoded.exp && Date.now() >= decoded.exp * 1000;
            const userRole = decoded.user_metadata?.user_type;

            // Token is expired, clear cookie and redirect to home
            if (isTokenExpired) {
                const response = NextResponse.redirect(new URL('/', request.url));
                response.cookies.delete(SB_TOKEN);
                return response;
            }

            // Check user role and route permissions
            if (userRole) {
                // Redirect to public routes if logged in
                if (publicRoutes.includes(pathName)) {
                    return NextResponse.redirect(new URL(defaultRoutes[userRole], request.url));
                }

                // Check route permissions
                if (roleRoutes[userRole]) {
                    if (!roleRoutes[userRole].includes(pathName)) {
                        return NextResponse.redirect(new URL(defaultRoutes[userRole], request.url));
                    }
                }
            }
        }

        return await updateSession(request)
    } catch (error) {
        console.error('Middleware error:', error);
        // Create a response to clear the cookie and redirect
        const response = NextResponse.redirect(new URL('/', request.url));
        if (SB_TOKEN) response.cookies.delete(SB_TOKEN);
        return response;
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)'
    ]
};
