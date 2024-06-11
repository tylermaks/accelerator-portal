import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Sidebar() {
    const user = await getUserData();
    const userName = `${user?.first_name} ${user?.last_name}`
    const userLinks = sideBarLinks.find(link => link.role === user?.role)

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
                                alt="logo" 
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
            <div>
                <p>{userName}</p>
            </div>
        </nav>
    );
}

async function getUserData() { 
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error fetching user:', error);
        redirect('/')
    }

    if (user) {
        const { data: user_profiles, error } = await supabase
            .from('user_profiles')
            .select('role, first_name, last_name')
            .eq('id', user.id)
            .single()
        
        if (error) {
            console.error('Error fetching user:', error);
            return null;
        } 
        
        return user_profiles
    } 
}

const sideBarLinks = [
    {
        role:'mentor',
        icons: ['/images/calendar-icon.svg', '/images/user-icon.svg', '/images/report-icon.svg', '/images/question-icon.svg',],
        links: ["Meeting Tracker", "Profile", "Reports", "FAQs"],
        routes: ['/mentor/meeting-tracker', '/mentor/profile', '/mentor/reports', '/mentor/faqs',],
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