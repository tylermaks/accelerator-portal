"use client"

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react"; 
import { getUserRole } from "@/lib/actions";
import { logout } from "@/lib/actions";

const sideBarLinks = [
    {
        role:'mentor',
        icons: ['/images/calendar-icon.svg', '/images/user-icon.svg', '/images/report-icon.svg', '/images/bolt-icon.svg', '/images/question-icon.svg',],
        links: ["Meeting Tracker", "Profile", "Reports", "Support Requests", "FAQs"],
        routes: ['/mentor/meeting-tracker', '/mentor/profile', '/mentor/reports', '/mentor/support-requests', '/mentor/faqs',],
    }, 
    {
        role:'company',
        icons: ['/images/calendar-icon.svg', '/images/user-icon.svg', '/images/report-icon.svg', '/images/question-icon.svg',],
        links: ["Dashboard", "Mentors", "FAQs"],
        routes: ['/company/dashboard', '/company/mentors', '/company/faqs'],
    }, 
    {
        role:'admin',
        icons: ['/images/calendar-icon.svg', '/images/user-icon.svg', '/images/report-icon.svg', '/images/question-icon.svg',],
        links: ["Dashboard", "Members", "Controls"],
        routes: ['/admin/dashboard', '/admin/members', '/admin/controls'],
    }, 
]



export default function Sidebar() {
    const [userRole, setUserRole] = useState<string | undefined>();

    const handleUserRole = async () => {
        const role = await getUserRole();
        setUserRole(role);
    }

    useEffect(() => {
        handleUserRole();
    }, [])
    
    const userLinks = sideBarLinks.find(link => link.role === userRole)

    return(
        <nav className="h-screen flex flex-col justify-between p-8 w-1/5 bg-teal text-gray-100 ">
            <div className="flex flex-col gap-8">
                <Image src="/images/logo-secondary.png" width={125} height={100} alt="logo" />
                {
                    userLinks?.links.map((link, index) => (
                        <div key={index} className="flex items-center gap-3.5">
                            <Image
                                className="filter invert"
                                src={userLinks.icons[index]} 
                                width={15} 
                                height={15} 
                                alt={link}
                            />
                            <Link
                                className="text-sm"
                                href={String(userLinks.routes[index])}    
                            >
                                {link}
                            </Link>
                        </div>  
                    ))
                }
            </div>
        
            <form className="flex items-center gap-3.5 cursor-pointer" action={logout} method="POST">
                <Image className="filter invert" src="/images/cog-icon.svg" width={15} height={15} alt="cog"/>
                <button type='submit' className="text-sm">Sign Out</button>
            </form>
            
        </nav>
    );
}
