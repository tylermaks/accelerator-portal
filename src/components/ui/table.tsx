"use client"

import { useState, useEffect, useRef } from "react"
import { useSortFilter } from "@/context/SortFilterContext"
import Image from "next/image"

type TableProps = {
    tableHeaders: string[]
    tableRows: {
        id: string;
        fields: {
            date: string;
            altName?: string;
            companyName: string;
            duration: string;
            supportType: string;
        }
    }[]
}

export default function Table({ tableHeaders, tableRows }: TableProps) {
    const [isFetching, setIsFetching] = useState(false)
    const { fetchSortFilteredData, appendTableData, hasMoreData } = useSortFilter()
    const scrollRef = useRef<HTMLDivElement>(null)

    const headerStyles = "p-3 text-left text-sm font-semibold text-gray-100 bg-teal-md"
    const rowStyles = "px-3 py-5 text-sm border-t border-gray-200 text-fsGray"

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
            // Use a fixed threshold for triggering the fetch
            if (scrollHeight - scrollTop - clientHeight < 100 && !isFetching && hasMoreData) {
                setIsFetching(true)
            }
        }
    }

    useEffect(() => {
        const scrollableElement = scrollRef.current
        if (scrollableElement) {
            scrollableElement.addEventListener("scroll", handleScroll)
            return () => scrollableElement.removeEventListener("scroll", handleScroll)
        }
    }, [])

    useEffect(() => {
        if (isFetching) {
            fetchSortFilteredData().then((newData: any) => {
                if (newData && newData.records) {
                    appendTableData(newData.records)
                }
                setIsFetching(false)
            }).catch(error => {
                console.error('Error fetching data:', error)
                setIsFetching(false)
            })
        }
    }, [isFetching, fetchSortFilteredData, appendTableData])

    return (
        <div ref={scrollRef} className="h-[35rem] overflow-y-scroll">
            <table className="w-full table table-compact table-auto rounded-md">
                <thead>
                    <tr>
                        {tableHeaders.map(header => (
                            <th
                                className={headerStyles}
                                key={header}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableRows?.map(row => (
                        <tr key={row.id}>
                            <td className={rowStyles}>{row.fields.date}</td>
                            <td className={rowStyles}>{row.fields.altName ? row.fields.altName : row.fields.companyName}</td>
                            <td className={rowStyles}>{row.fields.duration}</td>
                            <td className={rowStyles}>{row.fields.supportType}</td>
                            <td id={row.id} className={rowStyles}><Image className="cursor-pointer" src="/images/open-icon.svg" alt="Open record" width={20} height={20} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
