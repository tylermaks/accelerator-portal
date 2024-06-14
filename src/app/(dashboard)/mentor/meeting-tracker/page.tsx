import PageHeader from "@/components/ui/page-header";
import SummaryChart from "@/components/dashboard/mentor/summary-chart";
import TableWrapper from "@/components/dashboard/mentor/table-wrapper";
// import Table from "@/components/ui/table";
// import MeetingForm from "@/components/dashboard/mentor/meeting-form";
// import Modal from "@/components/ui/modal";
import { headers } from "next/headers";

const getData = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/tableData', {
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
            <TableWrapper data={data} />
        </div>
    )
}