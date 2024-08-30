"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { logout } from "@/lib/supabase-actions";

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

interface Link {
    role: string;
    icons: string[];
    links: string[];
    routes: string[];
}

const defaultLink: Link = {
    role: '',
    icons: [],
    links: [],
    routes: []
  };


export default function Sidebar() {
    const [userLinks, setUserLinks] = useState<Link>(defaultLink)

    useEffect(() => {
        const pathName = window.location.pathname
        const userRole = pathName.split('/')[1]
        const roleLinks = sideBarLinks.find(link => link.role === userRole)
        roleLinks && setUserLinks(roleLinks)
    }, [])

    return(
        <nav className="h-screen flex flex-col justify-between p-8 w-1/5 bg-teal text-gray-100 ">
            <div className="flex flex-col gap-8">
                <Image src="/images/logo-secondary.png" width={125} height={100} alt="logo" />
                {
                    userLinks?.links.map((link: string, index: number) => (
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
        
            <form className="flex items-center gap-3.5 cursor-pointer" action={logout}>
                <Image className="filter invert" src="/images/cog-icon.svg" width={15} height={15} alt="cog"/>
                <button type='submit' className="text-sm">Sign Out</button>
            </form>
        </nav>
    );
}
