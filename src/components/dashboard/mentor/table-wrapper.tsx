"use client"

import { useState, useOptimistic, useEffect } from "react"
import Table from "@/components/ui/table";
import Modal from "@/components/ui/modal";
import MeetingForm from "@/components/dashboard/mentor/meeting-form";
import MainButton from "@/components/ui/main-button";
import SortFilterButton from "@/components/dashboard/mentor/sort-filter-button";

type Record = { 
    id: string,
    createdTime: string;
    fields: {
        date: string;
        altName?: string;
        companyName: string;
        duration: string;
        supportType: string;
    }    
}

type TableData = { 
    records: Record[],
    offset: string;
}

type TableProps = {
    tableData: TableData;
    supportTypeList: string[];
    companyList: string[] 
}


export default function TableWrapper( {tableData, supportTypeList, companyList } : TableProps) { 
    const [rows, setRows] = useState<TableData>(tableData);
    const [showModal, setShowModal] = useState({ open: false, data: {} });
    const [optimisticRows, addOptimisticRow] = useOptimistic(
        rows?.records,
        (state, newRow: any) => [newRow, ...state] // Add new row to the beginning
    );

    useEffect(() => {
        if (tableData) {
            setRows(tableData)
        }
    }, [tableData])

    const toggleModal = ( modalData: {} = {}) => {
        setShowModal({open: !showModal.open, data: modalData});
    }

    return(
        <div className="flex flex-col">
            {showModal.open && 
                <Modal 
                    title={ Object.keys(showModal.data).length > 0 ? "Edit Meeting" : "Add Meeting"}
                    subtitle="Please add your meeting details"
                    action={toggleModal}
                >
                    <MeetingForm 
                        addOptimistic={addOptimisticRow}
                        toggleModal={toggleModal}
                        supportTypeOptions= {supportTypeList}
                        companyOptions={companyList}
                        data={ showModal.data }
                    />

                </Modal>
            } 

            
            <div className="flex justify-between mb-3">
                <div className="flex gap-4">
                    <SortFilterButton 
                        text="Sort"
                        icon="sort"
                    />
                    <SortFilterButton 
                        text="Filter"
                        icon="filter"
                    />
                </div>
                <div>
                    <MainButton 
                        id="addMeeting"
                        text="+ Add Meeting"
                        action={() => toggleModal()}
                        small={true}
                    />
                </div>
            </div>

            <Table 
                tableHeaders={["Date", "Company Name", "Duration (hrs)", "Support Type", ""]}
                tableRows={optimisticRows}
                toggleModal={toggleModal}
                offset={rows?.offset}
                setRows={setRows}
            />
        </div>
    )
}