"use client"

import { useState,  useEffect, useCallback } from "react";
import { getReportData } from "@/lib/report-actions";
import ReportTable from "@/components/dashboard/mentor/reports/report-table";

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

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]


export default function ReportWrapper() {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const yearsSince2022: number[] = [];
    
    const [reportData, setReportData] = useState<ReportDataProps[]>([]);
    const [totalHours, setTotalHours] = useState(0);
    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);

    for (let year = 2022; year <= currentYear; year++) {
        yearsSince2022.push(year);
    }

    const getData = useCallback( async () => {
        const data = await getReportData({month, year});
        const { records } = data;

        console.log("RECORDS", records)
        setReportData(records);
    }, [month, year])

    const calculateTotal = useCallback ( () => {
        const hourSum = reportData.reduce((sum, record) => sum + record.fields.duration, 0);
        setTotalHours(hourSum)
    }, [reportData])

    useEffect(() => {   
        getData()
    }, [getData])

    useEffect(() => {
        calculateTotal()
    },[calculateTotal])

    return (
        <div>
            <div className="flex bg-white rounded-md">
                <div className="w-2/3 p-4">
                    <div className="flex justify-between mb-6">
                        <p className="text-xl font-bold text-fsGray">{months[month - 1]} {year} EIR Hour Report</p>
                        <div className="flex gap-2">
                            <select
                                className="border border-gray-300 rounded-md px-2 py-1"
                                value={month}
                                onChange={(e) => setMonth(parseInt(e.target.value))}
                            >
                                { months.map((month, index) => (
                                    <option key={month} value={index + 1}>{month}</option>
                                ))}   
                            </select>

                            <select
                                className="border border-gray-300 rounded-md"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                            >
                                {yearsSince2022.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    
                    <ReportTable data={reportData} />
                </div>
                <div className="w-1/3 p-4 bg-blue-50 flex flex-col">
                    <div className="flex flex-col items-center justify-center p-8 border-b border-gray-300">
                        <p className="text-fsGray mb-4 text-sm">Total EIR Hours</p>
                        <p className="text-4xl text-fsGray font-bold">{totalHours}</p>
                        <p className="text-fsGray text-sm">Hours</p>
                        
                    </div>
                    <div className="flex justify-center gap-1 mt-4">
                        <p className="text-fsGray text-xs">Please submit invoice by:</p>
                        <p className="text-fsGray text-xs">{new Date(year, month, 10).toDateString()}</p>
                    </div>
                </div>
            </div> 
        </div>
    )
}