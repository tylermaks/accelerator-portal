import PageHeader from "@/components/ui/page-header";
import TableProvider from "@/components/providers";
import TableWrapper from "@/components/dashboard/mentor/table-wrapper";
import { headers } from "next/headers";

const url = `${process.env.URL_ROOT}/api/tableData`;
const getData = async () => {
    try {
        const response = await fetch(url, {
            headers: {
                cookie: headers().get("cookie") as string,
            },
            cache: "force-cache"
        });
        
        if (!response.ok) {
            // Handle response errors
            console.error("Fetch error:", response.statusText);
            return null;
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        // Handle network errors or other unexpected errors
        console.error("An error occurred:", error);
        return null;
    }
};
export default async function MeetingTracker() {
    return(
        <div className="flex flex-col gap-8">
            <PageHeader 
                title="Meeting Tracker"
                subTitle="View your meeting history"
            />

            <TableProvider>
                <TableWrapper/>
            </TableProvider>
        </div>
    )
}