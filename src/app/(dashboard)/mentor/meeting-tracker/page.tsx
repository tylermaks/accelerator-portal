import PageHeader from "@/components/ui/page-header";
import TableProvider from "@/components/providers";
import TableWrapper from "@/components/dashboard/mentor/table-wrapper";
import { getTableData } from "@/lib/meeting-actions";

export default async function MeetingTracker() {
    const initialData = await getTableData();

    return(
        <div className="flex flex-col gap-8">
            <PageHeader 
                title="Meeting Tracker"
                subTitle="View your meeting history"
            />

            <TableProvider>
                <TableWrapper initialData={initialData}/>
            </TableProvider>
        </div>
    )
}