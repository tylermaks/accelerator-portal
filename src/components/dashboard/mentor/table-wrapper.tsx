"use client"

import { useState, useOptimistic, useEffect } from "react"
import Table from "@/components/ui/table";
import Modal from "@/components/ui/modal";
import MeetingForm from "@/components/dashboard/mentor/meeting-form";
import MainButton from "@/components/ui/main-button";

export default function TableWrapper({ data }: any) {
    // const [rowData, setRowData] = useState<any>({});
    const [showModal, setShowModal] = useState(false);
    const [optimisticRows, addOptimisticRow] = useOptimistic(
        data.records,
        (state, newRow: any) => [newRow, ...state] // Add new row to the beginning
    );


    const toggleModal = () => {
        setShowModal(!showModal);
        console.log("SHOW MODAL", showModal);
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
            <div className="flex justify-end gap-8 mb-4">
                <div className="w-1/8">
                    <MainButton 
                        id="addMeeting"
                        text="+ Add Meeting"
                        action={toggleModal}
                        small={true}
                    />
                </div>

            </div>
            <Table 
                tableHeaders={["Date", "Company Name", "Duration (hrs)", "Support Type", ""]}
                tableRows={optimisticRows}
            />
        </div>
    )
}