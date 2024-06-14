"use client"

import { useState, useOptimistic } from "react"
import Table from "@/components/ui/table";
import Modal from "@/components/ui/modal";
import MeetingForm from "@/components/dashboard/mentor/meeting-form";
import MainButton from "@/components/ui/main-button";

export default function TableWrapper({ data } : any) {
    const [showModal, setShowModal] = useState(false);
    const [optimisticRows, addOptimisticRows] = useOptimistic(
        data?.records,
        (state, newRow) => { 
            // console.log("OPTIMISTIC", state, newRow)
            return[...state, newRow]}
    );


    return(
        <div>
            {showModal && 
                <Modal 
                    title="Add Meeting"
                    subtitle="Please add your meeting details"
                    // closeModal={() => setShowModal(false)}
                >
                    <MeetingForm 
                        addOptimistic={addOptimisticRows}
                        // closeModal={() => setShowModal(false)}
                    />
                </Modal>
            } 
            <div className="flex justify-end gap-8">
                <MainButton 
                    text="Add Meeting"
                    // action={setShowModal}
                />
            </div>
            <Table 
                tableHeaders={["Date", "Company Name", "Duration (hrs)", "Support Type", ""]}
                tableRows={optimisticRows}
            />
        </div>
    )
}