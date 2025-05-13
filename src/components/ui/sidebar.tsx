"use client"

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
                route: '/dashboard/faqs/eir'
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
                route: '/dashboard/faqs/mentor'
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
                route: '/dashboard/faqs/eir'
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

const handleSignOut = () => {
    window.location.href = '/signout'
}

export default function Sidebar({userType}: {userType: string}) {
    const pathName = usePathname();
    const userLinks = sideBarLinks.find(link => link.role === userType) ?? defaultLink;

    return(
        <nav className="h-screen flex flex-col justify-between p-8 w-1/5 bg-teal text-gray-100 ">
            <div className="flex flex-col gap-4">
                <Image src="/images/logo-secondary.png" width={125} height={100} alt="logo" />
                {
                    userLinks.links?.map( (link, index) => { 
                        const linkStyles = pathName.includes(link.route) ? "flex items-center gap-3 bg-teal-md p-2 rounded-md" : "flex items-center gap-3 p-2"
                        return (
                            <div key={index} className={linkStyles}>
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
        
            <form className="flex items-center gap-3.5 cursor-pointer" >
                <Image className="filter invert" src="/images/cog-icon.svg" width={15} height={15} alt="cog"/>
                <button type='submit' onClick={handleSignOut} className="text-sm">Sign Out</button>
            </form>
        </nav>
    );
}
