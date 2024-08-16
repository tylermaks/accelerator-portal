import PageHeader from "@/components/ui/page-header";
import TableWrapper from "@/components/dashboard/mentor/table-wrapper";
import { getTableData } from "@/lib/meeting-actions";

export default async function MeetingTracker({
    searchParams
  }: {
    searchParams: { [key: string]: string | undefined }
  }) {
    const initialData = await getTableData( null, searchParams );
  
    return (
      <div className="flex flex-col gap-8">
        <PageHeader 
          title="Meeting Tracker"
          subTitle="View your meeting history"
        />
        <TableWrapper initialData={initialData}/>
      </div>
    );
  }