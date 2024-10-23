import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";


const publicRoutes = ['/', '/reset-password', '/error']; 

const roleRoutes: { [key: string]: string[] } = {
    admin: ['/admin/dashboard', '/admin/members', '/admin/controls', '/mentor/meeting-tracker', '/mentor/profile', '/mentor/reports', '/mentor/support-requests', '/mentor/faqs'],
    mentor: ['/mentor/meeting-tracker', '/mentor/profile', '/mentor/reports', '/mentor/support-requests', '/mentor/faqs'],
    company: ['/company/dashboard', '/company/mentors', '/company/faqs'],
};

const defaultRoutes: { [key: string]: string } = {
    admin: '/admin/members',
    mentor: '/mentor/meeting-tracker',
    company: '/company/dashboard',
};


export async function middleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    const SB_TOKEN = process.env.SB_TOKEN;
    const cookie = SB_TOKEN && request.cookies.get(SB_TOKEN);
    const token = cookie && cookie.value;

    if(token){
        const decoded = jwtDecode<{ user_metadata?: { user_type?: string } }>(token);
        const userRole = decoded.user_metadata?.user_type;
         
        if(userRole && roleRoutes[userRole] && roleRoutes[userRole].includes(pathName)){
            return NextResponse.next();
        }

        if(userRole && !roleRoutes[userRole].includes(pathName)){ 
            return NextResponse.redirect(new URL(defaultRoutes[userRole], request.url));
        }


        if (userRole && publicRoutes.includes(pathName)) {
            return NextResponse.redirect(new URL(defaultRoutes[userRole], request.url));
        } 
    } 

    if(!token && !publicRoutes.includes(pathName)){ 
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)'
    ]
};

