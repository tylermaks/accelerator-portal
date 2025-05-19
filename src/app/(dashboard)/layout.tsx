import Sidebar from "@/components/ui/sidebar";
import { getCookie } from "@/utils/cookies";

export default async function DashboardLayout({children} : {children: React.ReactNode}) {
    const userType = await getCookie('user_type');
    return <main className="flex bg-gray-50">
        <Sidebar userType={userType || ''}/>
        <div className="h-screen w-full overflow-y-auto">
            {children}
        </div>  
    </main>;
}