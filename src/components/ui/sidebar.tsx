"use client"

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { logout } from "@/lib/supabase-actions";
import Link from "next/link";
import Image from "next/image";


const sideBarLinks = [
    {
        role:'eir',
        links: [
            {
                text: "Meeting Tracker",
                icon: '/images/calendar-icon.svg',
                route: '/dashboard/meeting-tracker'
            }, 
            { 
                text: "Reports",
                icon: '/images/report-icon.svg',
                route: '/dashboard/reports'
            },
            {
                text: "Profile",
                icon: '/images/user-icon.svg',
                route: '/dashboard/profile'
            },
            {
                text: "FAQs",
                icon: '/images/question-icon.svg',
                route: '/dashboard/faqs'
            }
        ]
    },
    {
        role:'mentor',
        links: [
            {
                text: "Meeting Tracker",
                icon: '/images/calendar-icon.svg',
                route: '/dashboard/meeting-tracker'
            }, 
            {
                text: "Profile",
                icon: '/images/user-icon.svg',
                route: '/dashboard/profile'
            },
            {
                text: "FAQs",
                icon: '/images/question-icon.svg',
                route: '/dashboard/faqs'
            }
        ]

    },
    {
        role: 'admin',
        links: [
            {
                text: "Members",
                icon: '/images/user-icon.svg',
                route: '/admin/members'
            },
            {
                text: "Meeting Tracker",
                icon: '/images/calendar-icon.svg',
                route: '/dashboard/meeting-tracker'
            }, 
            { 
                text: "Reports",
                icon: '/images/report-icon.svg',
                route: '/dashboard/reports'
            },
            {
                text: "Profile",
                icon: '/images/user-icon.svg',
                route: '/dashboard/profile'
            },
            {
                text: "FAQs",
                icon: '/images/question-icon.svg',
                route: '/dashboard/faqs'
            }
        ]

    }
]

type Link = {
    role: string;
    links: {
        text: string,
        icon: string,
        route: string
    }[]
}

const defaultLink: Link = {
    role: '',
    links: [
        {
            text:'',
            icon:'',
            route: ''
        }
    ]
  };


export default function Sidebar() {
    const [userLinks, setUserLinks] = useState<Link>(defaultLink)

    useEffect(() => {
        const cookie = document.cookie
        const decodedCookie = jwtDecode<{ user_metadata?: { user_type?: string } }>(cookie)
        const userType = decodedCookie?.user_metadata?.user_type 
        const roleLinks = sideBarLinks.find(link => link.role === userType)
        
        roleLinks && setUserLinks(roleLinks)
    }, [])

    return(
        <nav className="h-screen flex flex-col justify-between p-8 w-1/5 bg-teal text-gray-100 ">
            <div className="flex flex-col gap-8">
                <Image src="/images/logo-secondary.png" width={125} height={100} alt="logo" />
                {
                    userLinks.links?.map( (link, index) => { 
                        return (
                            <div key={index} className="flex items-center gap-3">
                                <Image
                                    className="filter invert"
                                    src={link.icon} 
                                    width={15} 
                                    height={15} 
                                    alt={link.text}
                                />
                                <Link
                                    className="text-sm"
                                    href={link.route}    
                                >
                                    {link.text}
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        
            <form className="flex items-center gap-3.5 cursor-pointer" action={logout}>
                <Image className="filter invert" src="/images/cog-icon.svg" width={15} height={15} alt="cog"/>
                <button type='submit' className="text-sm">Sign Out</button>
            </form>
        </nav>
    );
}
