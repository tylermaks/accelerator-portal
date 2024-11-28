import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";


const publicRoutes = ['/', '/reset-password', '/error']; 

const roleRoutes: { [key: string]: string[] } = {
    admin: ['/admin/dashboard', '/admin/members', '/admin/controls', '/dashboard/meeting-tracker', '/dashboard/profile', '/dashboard/reports', '/dashboard/support-requests', '/dashboard/faqs'],
    eir: ['/dashboard/meeting-tracker', '/dashboard/profile', '/dashboard/reports', '/dashboard/support-requests', '/dashboard/faqs'],
    mentor: ['/dashboard/meeting-tracker', '/dashboard/profile', '/dashboard/support-requests', '/dashboard/faqs'],
    company: ['/company/dashboard', '/company/mentors', '/company/faqs'],
};

const defaultRoutes: { [key: string]: string } = {
    admin: '/admin/members',
    eir: '/dashboard/meeting-tracker',
    mentor: '/dashboard/meeting-tracker',
    company: '/dashboard',
};


export async function middleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    const SB_TOKEN = process.env.SB_TOKEN;
    const cookie = SB_TOKEN && request.cookies.get(SB_TOKEN);
    const token = cookie && cookie.value;
   

    //if token is NOT expired then check the route and make a decision on where to go next
    if(token){
        const decoded = jwtDecode<{ exp?: number; user_metadata?: { user_type?: string } }>(token);
        const isTokenExpired = decoded.exp && Date.now() >= decoded.exp * 1000
        const userRole = decoded.user_metadata?.user_type

    
        if(userRole && roleRoutes[userRole] && roleRoutes[userRole].includes(pathName)){
            return NextResponse.next();
        }

        if(userRole && !roleRoutes[userRole].includes(pathName)){ 
            return NextResponse.redirect(new URL(defaultRoutes[userRole], request.url));
        } 

        if (userRole && publicRoutes.includes(pathName)) {
            return NextResponse.redirect(new URL(defaultRoutes[userRole], request.url));
        } 

        if(isTokenExpired && !publicRoutes.includes(pathName)){ 
            return NextResponse.redirect(new URL('/', request.url))
        }
    } 

    //If token is expired and user is trying to reach protected route, redirect to home
    if(!token && !publicRoutes.includes(pathName)){ 
        return NextResponse.redirect(new URL('/', request.url))
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)'
    ]
};

