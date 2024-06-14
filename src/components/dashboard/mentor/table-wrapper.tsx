"use client"

import { useState, useOptimistic } from "react"
import Table from "@/components/ui/table";
import Modal from "@/components/ui/modal";
import MeetingForm from "@/components/dashboard/mentor/meeting-form";
import MainButton from "@/components/ui/main-button";
import { addMeeting } from "@/lib/actions";

export default function TableWrapper({ data } : any) {
    const [showModal, setShowModal] = useState(false);
    const [optimisticRows, addOptimisticRows] = useOptimistic(
        data?.records,
        (state, newRow) => { 
            return[...state, newRow]}
    );

    const handleFormSubmit = async (formData: FormData, newMeeting: any) => {
        addOptimisticRows({
            id: Math.random(), 
            fields: newMeeting
        });
        setShowModal(false); 
        await addMeeting(formData);
    };

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
                        handleSubmit={handleFormSubmit}
                    />
                </Modal>
            } 
            <div className="flex justify-end gap-8">
                <MainButton 
                    text="Add Meeting"
                    action={toggleModal}
                />
            </div>
            <Table 
                tableHeaders={["Date", "Company Name", "Duration (hrs)", "Support Type", ""]}
                tableRows={optimisticRows}
            />
        </div>
    )
}