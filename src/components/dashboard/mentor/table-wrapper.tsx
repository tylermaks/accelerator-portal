"use client"

import { useState, useOptimistic, useEffect } from "react"
import Table from "@/components/ui/table";
import Modal from "@/components/ui/modal";
import MeetingForm from "@/components/dashboard/mentor/meeting-form";
import MainButton from "@/components/ui/main-button";
import SortFilterButton from "@/components/dashboard/mentor/sort-filter-button";

export default function TableWrapper({ data }: any) {
    // const [rowData, setRowData] = useState<any>({});
    const [showModal, setShowModal] = useState(false);
    const [optimisticRows, addOptimisticRow] = useOptimistic(
        data.records,
        (state, newRow: any) => [newRow, ...state] // Add new row to the beginning
    );


    const toggleModal = () => {
        setShowModal(!showModal);
    }


    return(
        <div>
            {showModal && 
                <Modal 
                    title="Add Meeting"
                    subtitle="Please add your meeting details"
                    action={toggleModal}
                >
                    <MeetingForm 
                        addOptimistic={addOptimisticRow}
                        toggleModal={toggleModal}
                    />
                </Modal>
            } 
            
            <div className="flex gap-4 mb-3">
                
                    <SortFilterButton 
                        text="Sort"
                        icon="sort"
                    />

                    <SortFilterButton 
                        text="Filter"
                        icon="filter"
                    />

                    {/* <MainButton 
                        id="sort"
                        text="Sort"
                        altButton={true}
                        small={true}
                        action={toggleModal}
                    />
                    <MainButton 
                        id="addMeeting"
                        text="+ Add Meeting"
                        action={toggleModal}
                        small={true}
                    /> */}
            </div>

            
            <Table 
                tableHeaders={["Date", "Company Name", "Duration (hrs)", "Support Type", ""]}
                tableRows={optimisticRows}
            />
        </div>
    )
}