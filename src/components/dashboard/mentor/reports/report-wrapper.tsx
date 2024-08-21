"use client"

import { useState,  useEffect } from "react";
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
    const [total, setTotal] = useState(0);
    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);

    for (let year = 2022; year <= currentYear; year++) {
        yearsSince2022.push(year);
    }

    const getData =  async () => {
        const data = await getReportData({month, year});
        const { records } = data;
        setReportData(records);
    }

    const calculateTotal = () => {
        const totalHours = reportData.reduce((sum, record) => sum + record.fields.duration, 0);
        console.log(totalHours)
        setTotal(totalHours);
    }

    useEffect(() => {   
        getData()
    }, [month, year])

    useEffect(() => {
        calculateTotal()
    },[reportData])

    return (
        <div>
            <div className="flex justify-end mb-4">
                <div className="flex gap-2">
                    <select
                        className="border border-gray-300 rounded-md p-0.5"
                        value={month}
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                    >
                        { months.map((month, index) => (
                            <option key={month} value={index + 1}>{month}</option>
                        ))}   
                    </select>

                    <select
                        className="border border-gray-300 rounded-md p-1.5"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                    >
                        {yearsSince2022.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex bg-white rounded-md">
                <div className="w-2/3 p-4">
                    <p className="text-fsGray mb-4">{months[month - 1]} {year} EIR Hour Report</p>
                    <ReportTable data={reportData} />
                </div>
                <div className="w-1/3 p-4 bg-gray-100 flex flex-col items-center justify-center">
                
                    <p className="text-fsGray mb-4">Total EIR Hours</p>
                    <p className="text-4xl font-bold">{total}</p>
                    <p className="text-fsGray">Hours</p>
                    <hr />

                    <p className="text-fsGray mt-4">Due Date</p>
                    <p className="text-xl font-bold">{new Date(year, month, 10).toDateString()}</p>
  
                </div>

            </div>
           
            
        </div>
    
    )
}