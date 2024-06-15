import PageHeader from "@/components/ui/page-header";
import SummaryChart from "@/components/dashboard/mentor/summary-chart";
import TableWrapper from "@/components/dashboard/mentor/table-wrapper";
import { headers } from "next/headers";

const url = `${process.env.URL_ROOT}/api/tableData`;
const getData = async () => {
    try {
        const response = await fetch(url, {
            headers: {
                cookie: headers().get("cookie") as string,
            },
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
    const data = await getData();

    return(
        <div className="flex flex-col gap-8">
            <PageHeader 
                title="Meeting Tracker"
                subTitle="View your meeting history"
            />
            <SummaryChart />
            <TableWrapper data={data}/>
        </div>
    )
}