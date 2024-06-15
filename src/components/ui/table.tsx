import Image from "next/image"

type TableProps = {
    tableHeaders: string[]
    tableRows: any[]
}

export default function Table( { tableHeaders, tableRows } : TableProps) {
    const headerStyles = "p-3 text-left text-sm font-semibold text-gray-100 bg-teal-md opacity-65 top-0"
    const rowStyles = "px-3 py-5 text-sm border-t border-gray-200 text-fsGray"

    return(
        <table className="w-full table table-compact table-auto rounded-md">
            <thead>
                <tr >
                    {tableHeaders.map(header => {
                        return(
                            <th 
                                className={headerStyles}   
                                key={header}
                            >
                                {header}
                            </th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                { tableRows?.map(row => { 
                        return(
                            <tr key={row.id}>
                                <td className={rowStyles}>{row.fields.date}</td>
                                <td className={rowStyles}>{row.fields.altName ? row.fields.altName : row.fields.companyName} </td>
                                <td className={rowStyles}>{row.fields.duration}</td>
                                <td className={rowStyles}>{row.fields.supportType}</td>
                                <td id={row.id} className={rowStyles}><Image className="cursor-pointer" src="/images/open-icon.svg" alt="Open record" width={"20"} height={"20"}/></td>    
                            </tr>
                        )
                    })}
            </tbody>
        </table>
    )
}