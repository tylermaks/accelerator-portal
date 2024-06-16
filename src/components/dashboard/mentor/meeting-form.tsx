"use client"

import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import MainButton from "@/components/ui/main-button";
import { useEffect, useState, useRef } from "react";
import { addMeeting } from "@/lib/actions";



export default function MeetingForm( { toggleModal, addOptimistic } : any) {
    const [companyList, setCompanyList] = useState<any>([]);
    const [clickedButton, setClickedButton] = useState<string>("");
    const [supportType, setSupportType] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

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

 
    
    const getButtonID = (event: React.MouseEvent<HTMLButtonElement>) => {
        setClickedButton(event.currentTarget.id);
    };

  
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

        if (clickedButton === "submit-meeting"){
            await toggleModal();
        } else { 
            formRef.current?.reset();
        }

        try {
            await addMeeting(formData); 
        } catch (error) {
            console.error('Error adding meeting:', error);
        } finally {
            setLoading(false);
        }
    };

    return(
        <form 
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSubmit(formData as unknown as FormData);
            }} 
            className="flex flex-col gap-6"
            ref={formRef}
            >
           <Select 
                label="Support Type"
                id="supportType"
                name="supportType"
                data={supportOptions}
                setFormState={setSupportType}
                isRequired={true}
           />
           { (supportType === "Content Development" || supportType === "Other" || supportType === "Intake")  ? (
                <Input 
                    label={`Please provide project name:`}
                    type="text"
                    id="companyName"
                    name="companyName"
                    isRequired={true}
                />
  
           ) : (
                <Select 
                    label="Company Name"
                    id="companyName"
                    name="companyName"
                    data={companyList.records}
                    searchable={true}
                    isRequired={true}
                />
           )}
           
            <Input 
                label="Date"
                type="date"
                id="date"
                name="date"
                isRequired={true}
            />
            <Input 
                label="Duration (hrs)"
                type="number"
                id="duration"
                name="duration"
                isRequired={true}
            />
           <Textarea 
                name="notes" 
                label="Notes"
            /> 

            <div className="flex gap-4">
                <MainButton 
                    id="submit-meeting"
                    text="Submit"  
                    action={getButtonID}
                />
                <MainButton 
                    id="add-another-meeting"
                    text="Submit and add another" 
                    altButton={true}
                    action={getButtonID}
                />
            </div>
        </form>
    )
}