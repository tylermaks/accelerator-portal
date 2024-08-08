import PageHeader from "@/components/ui/page-header";
import TableWrapper from "@/components/dashboard/mentor/table-wrapper";
import { getTableData } from "@/lib/meeting-actions";
// import TableProvider from "@/components/providers";

export default async function MeetingTracker({
    searchParams
  }: {
    searchParams: { [key: string]: string | string[] | undefined }
  }) {
    const sortParams: { [key: string]: string | string[] | undefined } = {};

    for (const key in searchParams) {
        if (searchParams.hasOwnProperty(key)) {
          const value = searchParams[key];
          if (typeof value === "string" || Array.isArray(value)) {
            sortParams[key] = value;
          }
        }
    }
  
    const initialData = await getTableData( null, sortParams, null );
  
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