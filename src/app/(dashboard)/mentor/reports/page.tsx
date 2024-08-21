import PageHeader from "@/components/ui/page-header";
import ReportWrapper from "@/components/dashboard/mentor/reports/report-wrapper";


export default async function Reports() {
    return (
        <div className="flex flex-col gap-8">
            <PageHeader 
                title="Reports"
                subTitle="View your monthly reports"
            />
            <ReportWrapper />
        </div>
    )
}