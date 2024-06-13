import Sidebar from "@/components/ui/sidebar";
export default function DashboardLayout({children} : {children: React.ReactNode}) {
    return <main className="flex bg-gray-50">
        <Sidebar />
        <div className="h-screen w-full overflow-y-auto px-8 py-10">
            {children}
        </div>  
    </main>;
}