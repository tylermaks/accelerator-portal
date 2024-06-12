import PageHeader from "@/components/ui/page-header";
import SummaryChart from "@/components/dashboard/mentor/summary-chart";
import Table from "@/components/ui/table";
import MeetingForm from "@/components/dashboard/mentor/meeting-form";
import Modal from "@/components/ui/modal";
import { headers } from "next/headers";

const getData = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/getTableData', {
            headers: {
                cookie: headers().get("cookie") as string,
            },
            cache: 'force-cache'
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
            <Modal 
                title="Add Meeting"
                subtitle="Please add your meeting details"
            >
                <MeetingForm />
            </Modal>
            <PageHeader 
                title="Meeting Tracker"
                subTitle="View your meeting history"
            />
            <SummaryChart />
            <Table 
                tableHeaders={["Date", "Company Name", "Duration (hrs)", "Support Type", ""]}
                tableRows={data?.records}
            />
        </div>
    )
}