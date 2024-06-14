import { NextRequest, NextResponse } from "next/server";
import { updateSession } from '@/utils/supabase/middleware';
import { createClient } from '@/utils/supabase/server';

const publicRoutes = ['/', '/reset-password'];

const roleRoutes = {
    admin: ['/admin/dashboard', '/admin/members', '/admin/controls'],
    mentor: ['/mentor/meeting-tracker', '/mentor/profile', '/mentor/reports', '/mentor/faqs'],
    company: ['/company/dashboard', '/company/mentors', '/company/faqs'],
};

const defaultRoutes = {
    admin: '/admin/dashboard',
    mentor: '/mentor/meeting-tracker',
    company: '/company/dashboard',
};

type UserRole = keyof typeof defaultRoutes;

export async function middleware(request: NextRequest) {
    const supabaseClient = createClient();

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    const { pathname } = request.nextUrl;

    if (userError) {
        // Handle error in getting user
        console.error('Error getting user:', userError);
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (user) {
        // Only fetch the user role if necessary
        let userRole: UserRole | null = null;
        const roleCheckRequired = !publicRoutes.includes(pathname) && !pathname.startsWith('/api') && !pathname.startsWith('/_next');
        if (roleCheckRequired) {
            const start = performance.now(); // Start timing

            const { data: user_profiles, error: profileError } = await supabaseClient
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            const end = performance.now(); // End timing

            console.log(`Role retrieval took ${end - start} milliseconds`);

            if (profileError) {
                console.error('Error getting user profile:', profileError);
                return NextResponse.redirect(new URL('/', request.url));
            }

            if (user_profiles?.role && (user_profiles.role in defaultRoutes)) {
                userRole = user_profiles.role as UserRole;
            }

            if (userRole) {
                // Redirect to default route if accessing base route
                if (pathname === `/${userRole}`) {
                    return NextResponse.redirect(new URL(defaultRoutes[userRole], request.url));
                }

                // Redirect to default route if accessing unauthorized route
                if (!roleRoutes[userRole]?.includes(pathname)) {
                    return NextResponse.redirect(new URL(defaultRoutes[userRole], request.url));
                }
            } else {
                return NextResponse.redirect(new URL('/', request.url));
            }
        }
    } else {
        // Avoid redirect loop if already on the login page
        if (!publicRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return await updateSession(request);
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)'
    ]
};
