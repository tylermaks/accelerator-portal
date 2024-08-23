import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";


const publicRoutes = ['/', '/forgotpassword', '/signup', '/error'];

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
    const pathName = request.nextUrl.pathname;

    if (publicRoutes.includes(pathName)) {
        return NextResponse.next();
    }

    const SB_TOKEN = process.env.SB_TOKEN;
    const cookie = SB_TOKEN && request.cookies.get(SB_TOKEN);

    if (!cookie) {
        return NextResponse.redirect(new URL('/error', request.url));
    }
    
    const token = cookie && cookie.value;

    if(token){
        const decoded = jwtDecode<{ user_metadata?: { user_type?: string } }>(token);
        const userRole = decoded.user_metadata?.user_type;

        if(userRole && roleRoutes[userRole] && roleRoutes[userRole].includes(pathName)){
            return NextResponse.next();
        } else { 
            if (userRole) {
                return NextResponse.redirect(new URL(defaultRoutes[userRole], request.url));
            } else {
                // Handle the case where userRole is undefined (e.g., return an error response or a default redirect)
                return NextResponse.redirect(new URL('/error', request.url));
            }
        }
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)'
    ]
};

