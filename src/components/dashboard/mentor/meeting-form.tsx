"use client"

import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import MainButton from "@/components/ui/main-button";
import { useEffect, useState } from "react";
// import { getCompanyList } from "@/lib/actions";
import { addMeeting } from "@/lib/actions";
import { revalidatePath } from "next/cache";


export default function MeetingForm( { toggleModal, addOptimistic } : any) {
    const [companyList, setCompanyList] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const supportOptions: string[] = [
        "Supporting a company", 
        "Program Moderation", 
        "Goodwill Advising", 
        "Access to Capital", 
        "Advisory Board", 
        "Content Development", 
        "Intake", 
        "Other"
    ]

    const getCompanyData = async () => {
        const response = await fetch("/api/getCompanyList", { 
            headers: {
                contentType: "application/json",
                credentials: "include",
            },
            cache: "force-cache"
        });

        if (!response.ok) {
            // Handle response errors
            console.error("Fetch error:", response.statusText);
            return null;
        }
        
        const data = await response.json();
        console.log("COMPANY LIST", data);
        setCompanyList(data);
    }

    useEffect(() => {
        getCompanyData();
    }, [])

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);

        const newMeeting = {
            date: formData.get("date"),
            companyName: formData.get("companyName"),
            duration: formData.get("duration"),
            supportType: formData.get("supportType"),
            notes: formData.get("notes")
        }

        addOptimistic({
            id: Math.random(),
            fields: newMeeting
        });

        toggleModal();
        addMeeting(formData);
        revalidatePath("/mentor/meeting-tracker");
        setLoading(false);
    };


    
    return(
        <form action={handleSubmit} className="flex flex-col gap-6">
           <Select 
                label="Support Type"
                id="supportType"
                name="supportType"
                data={supportOptions}
           />
           <Select 
                label="Company Name"
                id="companyName"
                name="companyName"
                data={companyList.records}
                searchable={true}
           />
            <Input 
                label="Date"
                type="date"
                id="date"
                name="date"
            />
            <Input 
                label="Duration (hrs)"
                type="number"
                id="duration"
                name="duration"
            />
           <Textarea 
                name="notes" 
                label="Notes"
            /> 

            <div className="flex gap-4">
                <MainButton text="Submit" loading={loading}/>
                <MainButton text="Submit and add another" altButton={true}/>
            </div>
        </form>
    )
}