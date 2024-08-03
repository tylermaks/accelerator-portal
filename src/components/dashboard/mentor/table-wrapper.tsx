"use client"

import { useState, useOptimistic, useEffect } from "react"
import { useSortFilter } from "@/context/SortFilterContext"
import Table from "@/components/ui/table";
import Modal from "@/components/ui/modal";
import MeetingForm from "@/components/dashboard/mentor/meeting-form";
import MainButton from "@/components/ui/main-button";
import SortFilterButton from "@/components/dashboard/mentor/sort-filter-button";

export default function TableWrapper() {
    const { tableData } = useSortFilter()
    const [showModal, setShowModal] = useState({ open: false, data: {} });
    const [optimisticRows, addOptimisticRow] = useOptimistic(
        tableData,
        (state, newRow: any) => [newRow, ...state] // Add new row to the beginning
    );


    const toggleModal = ( modalData: {} = {}) => {
        setShowModal({open: !showModal.open, data: modalData});
    }


    useEffect(() => {
        console.log("MODAL FROM TABLE WRAPPER", showModal)
    }, [showModal])


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
            />
            
        </div>
    )
}