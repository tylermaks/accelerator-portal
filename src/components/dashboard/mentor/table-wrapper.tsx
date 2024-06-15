"use client"

import { useState, useOptimistic, useEffect } from "react"
import Table from "@/components/ui/table";
import Modal from "@/components/ui/modal";
import MeetingForm from "@/components/dashboard/mentor/meeting-form";
import MainButton from "@/components/ui/main-button";

export default function TableWrapper() {
    const [rowData, setRowData] = useState<any>({});
    const [showModal, setShowModal] = useState(false);
    const [optimisticRows, addOptimisticRow] = useOptimistic(
        rowData.records, 
        (state, newRow: any) => [...state, newRow]
    );

    const getData = async () => {
        try {
            const response = await fetch("/api/tableData", {
                headers: {
                    contentType: "application/json",
                    credentials: "include",
                },
                
            });
            
            if (!response.ok) {
                // Handle response errors
                console.error("Fetch error:", response.statusText);
                return null;
            }
            
            const data = await response.json();
            setRowData(data);
        } catch (error) {
            // Handle network errors or other unexpected errors
            console.error("An error occurred:", error);
            return null;
        }
    };

    useEffect(() => {
        getData();
    }, [])


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
            <div className="flex justify-end gap-8 mb-4">
                <div className="w-1/8">
                    <MainButton 
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