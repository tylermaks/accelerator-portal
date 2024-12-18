type ReportDataProps = {
    id: string;
    createdTime: string;
    fields: {
        companyName: string;
        altName?: string;
        supportType: string;
        date: string;
        meetingObjective: string;
        duration: number;
    };
}

const headerClass = "py-2 text-left text-sm font-semibold"
const rowClass = "py-1 text-sm"
export default function ReportTable({data}: {data: ReportDataProps[]}) {
    return(
        data && data.length > 0  ? ( 
            <table className="w-full text-fsGray">
                <thead>
                    <tr>
                        <th className={headerClass}>Date</th>
                        <th className={headerClass}>Company Name</th>
                        <th className={headerClass}>Support Type</th>
                        <th className={headerClass}>Meeting Objective</th>
                        <th className={`${headerClass} text-center`}>Duration</th>
                    </tr>
                </thead>
                <tbody className="py-3">
                    {data.map((item, index) => (
                        <tr  key={index}>
                            <td className={rowClass}>{item.fields.date}</td>
                            <td className={rowClass}>{item.fields.companyName} {item.fields.altName ? `- ${item.fields.altName}` : ""}</td>
                            <td className={rowClass}>{item.fields.supportType}</td>
                            <td className={rowClass}>{item.fields.meetingObjective}</td>
                            <td className={`${rowClass} text-center`}>{item.fields.duration}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p className="mt-4 text-fsGray text-sm">No meetings found</p>
        )  
    )
}