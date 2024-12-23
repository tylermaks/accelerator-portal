"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { infiniteScrollData } from "@/lib/meeting-actions"
import Image from "next/image"

type TableProps = {
    toggleModal: (row: { id: string; fields: { date: string; altName?: string; companyName: string; duration: string; supportType: string; } } ) => void;
    tableHeaders: string[];
    offset?: string;
    setRows: (params: {records:any[], offset: string}) => void;
    tableRows: {
        id: string;
        fields: {
            date: string;
            altName?: string;
            companyName: string;
            duration: string;
            supportType: string;
            meetingObjective: string;
        }
    }[]
}

export default function Table({ tableHeaders, tableRows, toggleModal, offset, setRows}: TableProps) {
    const [isFetching, setIsFetching] = useState(false)
    const [hasMoreData, setHasMoreData] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)

    const handleScroll = useCallback( () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
            if (scrollHeight - scrollTop - clientHeight < 100 && !isFetching && hasMoreData) {
                setIsFetching(true)
            }
        }
    }, [isFetching, hasMoreData]);

    const infiniteScroll = useCallback( async () => {
        if (!hasMoreData) return;
        const additionalRows = await infiniteScrollData(offset);

        if (!additionalRows.offset) {
            setHasMoreData(false);
        }

        let appendedRows = [...tableRows, ...additionalRows.records];

        setRows({
            records: appendedRows,
            offset: additionalRows.offset
        });

        setIsFetching(false);
    }, [offset, tableRows, setRows, hasMoreData]);

    useEffect(() => {
        const scrollableElement = scrollRef.current
        if (scrollableElement) {
            scrollableElement.addEventListener("scroll", handleScroll)
            return () => scrollableElement.removeEventListener("scroll", handleScroll)
        }
    }, [handleScroll])

    useEffect(() => {
        if (isFetching) {
            infiniteScroll()
        }
    }, [isFetching, infiniteScroll]);

    const headerStyles = "p-3 text-left text-sm font-semibold text-gray-100 bg-teal-md"
    const rowStyles = "px-3 py-5 text-sm border-t border-gray-200 text-fsGray"

    return (
        <div ref={scrollRef} className="h-[45rem] overflow-y-scroll">
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
                    {tableRows?.map((row) => (
                        <tr key={row.id}>
                            <td className={rowStyles}>{row.fields.date}</td>
                            <td className={rowStyles}>{row.fields.altName ? row.fields.altName : row.fields.companyName}</td>
                            <td className={rowStyles}>{row.fields.duration}</td>
                            <td className={rowStyles}>{row.fields.supportType}</td>
                            <td className={rowStyles}>{row.fields.meetingObjective}</td>
                            <td 
                                id={row.id} 
                                className={`${rowStyles} cursor-pointer`}
                                onClick={() => toggleModal(row)}
                            >
                                <Image 
                                    className="inline-block"
                                    src="/images/open-icon.svg" 
                                    alt="Open record" 
                                    width={20} 
                                    height={20}
                                />

                                <p  className="inline-block ml-2 text-fsGray text-xs m-0">Edit</p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
