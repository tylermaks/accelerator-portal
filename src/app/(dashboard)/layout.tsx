import Sidebar from "@/components/ui/sidebar";
export default function DashboardLayout({children} : {children: React.ReactNode}) {
    return <main className="flex">
        <Sidebar />
        <div className="h-screen w-full overflow-y-auto p-8">
            {children}
        </div>  
    </main>;
}